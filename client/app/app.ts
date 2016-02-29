
angular.module('siteApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'btford.socket-io',
  'ui.router',
  'ui.router.title',
  'ui.bootstrap',
  'LocalStorageModule',
  'analytics.mixpanel',
  'monospaced.elastic'
])
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $httpProvider,
    $mixpanelProvider,
    ComponentLibraryProvider: Higherframe.Drawing.Component.Library.ServiceProvider
  ) {

    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    $mixpanelProvider.apiKey('@@mixpanel.key');

    // Register components
    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Rectangle],
      title: Common.Drawing.Component.Library.Rectangle.title,
      icon: '/assets/images/components/rectangle.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Ellipse],
      title: Common.Drawing.Component.Library.Ellipse.title,
      icon: '/assets/images/components/ellipse.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Arrow],
      title: Common.Drawing.Component.Library.Arrow.title,
      icon: '/assets/images/components/line.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Label],
      title: Common.Drawing.Component.Library.Label.title,
      icon: '/assets/images/components/text.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Image],
      title: Common.Drawing.Component.Library.Image.title,
      icon: '/assets/images/components/image.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.TextInput],
      title: Common.Drawing.Component.Library.TextInput.title,
      icon: '/assets/images/components/text-input.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.SelectInput],
      title: Common.Drawing.Component.Library.SelectInput.title,
      icon: '/assets/images/components/select-input.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Checkbox],
      title: Common.Drawing.Component.Library.Checkbox.title,
      icon: '/assets/images/components/checkbox.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Button],
      title: Common.Drawing.Component.Library.Button.title,
      icon: '/assets/images/components/button.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Icon],
      title: Common.Drawing.Component.Library.Icon.title,
      icon: '/assets/images/components/icon.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Browser],
      title: Common.Drawing.Component.Library.Browser.title,
      icon: '/assets/images/components/browser.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.MobileDevice],
      title: Common.Drawing.Component.Library.MobileDevice.title,
      icon: '/assets/images/components/mobile.svg'
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.MobileTitlebar],
      title: Common.Drawing.Component.Library.MobileTitlebar.title,
      icon: '/assets/images/components/mobile-titlebar.svg'
    });
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, $document, $window, $timeout, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

    // Handle errors in routing
    $rootScope.$on('$stateChangeError', function() {

    });

    // Analytics
    $rootScope.$on('$stateChangeSuccess', function() {

      $window.ga('send', 'pageview', { page: $location.url() });
    });

    // Page transition class
    $rootScope.$on('$stateChangeStart', function (event, next, foo, prev) {

      var body = angular.element($document[0].body);

      if (next) {

        var ui = next.ui || 'default';
        body.addClass(`page-transition-${ ui }-enter`);
      }

      if (prev) {

        var ui = prev.ui || 'default';
        body.addClass(`page-transition-${ ui }-leave`);
      }
    });

    $rootScope.$on('$stateChangeSuccess', function() {

      var body = $document[0].body;
      var $body = angular.element(body);
      var classes = body.className.split(/\s+/);

      $timeout(() => {

        classes
          .filter((cl) => {

            return cl.match(/^page-transition-/);
          })
          .forEach((cl) => {

            $body.removeClass(cl);
          });
      }, 700);
    });
  });
