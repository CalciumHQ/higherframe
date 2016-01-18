#! /bin/bash
# deploy.sh

SHA1=$1
EB_ENVIRONMENT=$2

# Deploy image to Docker Hub
docker push higherframe/web:$SHA1

# Create a new Elastic Beanstalk version
EB_BUCKET=higherframe-deployment
EB_APPLICATION=Higherframe
DOCKER_ZIP=$SHA1-Docker.zip

sed "s/<TAG>/$SHA1/" < Dockerrun.aws.json.template > Dockerrun.aws.json

# Create archive to ship
zip $CIRCLE_ARTIFACTS/$DOCKER_ZIP -r Dockerrun.aws.json .ebextensions/

# Create new Elastic Beanstalk version
aws s3 cp $CIRCLE_ARTIFACTS/$DOCKER_ZIP s3://$EB_BUCKET/$DOCKER_ZIP
aws elasticbeanstalk create-application-version --application-name $EB_APPLICATION \
  --version-label $SHA1 --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKER_ZIP

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name $EB_ENVIRONMENT \
    --version-label $SHA1
