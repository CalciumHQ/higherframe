
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
  'minicolors'
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
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Rectangle],
      title: Common.Drawing.Library.Rectangle.title,
      icon: '/assets/images/components/rectangle.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Rectangle()),
      shortcut: {
        code: 117   // u
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Ellipse],
      title: Common.Drawing.Library.Ellipse.title,
      icon: '/assets/images/components/ellipse.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Ellipse())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Arrow],
      title: Common.Drawing.Library.Arrow.title,
      icon: '/assets/images/components/line.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Arrow()),
      shortcut: {
        code: 47   // /
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Label],
      title: Common.Drawing.Library.Label.title,
      icon: '/assets/images/components/text.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Label()),
      shortcut: {
        code: 116   // t
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Image],
      title: Common.Drawing.Library.Image.title,
      icon: '/assets/images/components/image.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Image()),
      shortcut: {
        code: 105   // i
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.TextInput],
      title: Common.Drawing.Library.TextInput.title,
      icon: '/assets/images/components/text-input.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.TextInput()),
      shortcut: {
        code: 102   // f
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.SelectInput],
      title: Common.Drawing.Library.SelectInput.title,
      icon: '/assets/images/components/select-input.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.SelectInput())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Checkbox],
      title: Common.Drawing.Library.Checkbox.title,
      icon: '/assets/images/components/checkbox.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Checkbox())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Button],
      title: Common.Drawing.Library.Button.title,
      icon: '/assets/images/components/button.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Button()),
      shortcut: {
        code: 98   // b
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Icon],
      title: Common.Drawing.Library.Icon.title,
      icon: '/assets/images/components/icon.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Icon())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.Browser],
      title: Common.Drawing.Library.Browser.title,
      icon: '/assets/images/components/browser.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.Browser()),
      shortcut: {
        code: 99   // c
      }
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.MobileDevice],
      title: Common.Drawing.Library.MobileDevice.title,
      icon: '/assets/images/components/mobile.svg',
      tool: new Higherframe.Wireframe.Tools.Draw(new Higherframe.Wireframe.Tools.Delegates.MobileDevice())
    });

    ComponentLibraryProvider.register({
      id: Common.Drawing.ComponentType[Common.Drawing.ComponentType.MobileTitlebar],
      title: Common.Drawing.Library.MobileTitlebar.title,
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
