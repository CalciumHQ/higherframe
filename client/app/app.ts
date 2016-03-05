
angular.module('siteApp.library', []);

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
  'monospaced.elastic',
  'siteApp.library',
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
      icon: '/assets/images/components/rectangle.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Rectangle()),
      shortcut: {
        code: 117   // u
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Ellipse],
      title: Common.Drawing.Component.Library.Ellipse.title,
      icon: '/assets/images/components/ellipse.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Ellipse())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Arrow],
      title: Common.Drawing.Component.Library.Arrow.title,
      icon: '/assets/images/components/line.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Arrow()),
      shortcut: {
        code: 47   // /
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Label],
      title: Common.Drawing.Component.Library.Label.title,
      icon: '/assets/images/components/text.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Label()),
      shortcut: {
        code: 116   // t
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Image],
      title: Common.Drawing.Component.Library.Image.title,
      icon: '/assets/images/components/image.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Image()),
      shortcut: {
        code: 105   // i
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.TextInput],
      title: Common.Drawing.Component.Library.TextInput.title,
      icon: '/assets/images/components/text-input.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.TextInput()),
      shortcut: {
        code: 102   // f
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.SelectInput],
      title: Common.Drawing.Component.Library.SelectInput.title,
      icon: '/assets/images/components/select-input.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.SelectInput())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Checkbox],
      title: Common.Drawing.Component.Library.Checkbox.title,
      icon: '/assets/images/components/checkbox.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Checkbox())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Button],
      title: Common.Drawing.Component.Library.Button.title,
      icon: '/assets/images/components/button.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Button()),
      shortcut: {
        code: 98   // b
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Icon],
      title: Common.Drawing.Component.Library.Icon.title,
      icon: '/assets/images/components/icon.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Icon())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.Browser],
      title: Common.Drawing.Component.Library.Browser.title,
      icon: '/assets/images/components/browser.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Browser()),
      shortcut: {
        code: 99   // c
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.MobileDevice],
      title: Common.Drawing.Component.Library.MobileDevice.title,
      icon: '/assets/images/components/mobile.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.MobileDevice())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.Component.Type[Common.Drawing.Component.Type.MobileTitlebar],
      title: Common.Drawing.Component.Library.MobileTitlebar.title,
      icon: '/assets/images/components/mobile-titlebar.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.MobileTitlebar())
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
