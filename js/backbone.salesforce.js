(function() {
  var API_VERSION, AUTH_HEADER, getUrl, methodMap, urlError;
  API_VERSION = '23.0';
  AUTH_HEADER = "Authorization";
  methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read': 'GET'
  };
  Backbone.Salesforce = {
    urlRoot: '/services',
    service: 'apexrest',
    sessionId: null
  };
  Backbone.sync = function(method, model, options) {
    var elements, instance, instanceUrl, params, proxyUrl, url;
    if (options.url) {
      url = options.url;
    } else {
      url = getUrl(model) || urlError();
    }
    elements = location.hostname.split(".");
    if (elements.length === 3) {
      instance = elements[0];
    } else {
      instance = elements[1];
    }
    instanceUrl = "https://" + instance + ".salesforce.com";
    url = instanceUrl + Backbone.Salesforce.urlRoot + '/' + Backbone.Salesforce.service + '/' + url;
    proxyUrl = location.protocol + "//" + location.hostname + "/services/proxy";
    params = {
      type: methodMap[method],
      async: false,
      url: proxyUrl,
      contentType: 'application/json',
      processData: false,
      dataType: 'json',
      error: function(xhr, textStatus, errorThrown) {},
      done: function(data, textStatus, jqXHR) {},
      beforeSend: function(xhr) {
        xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
        xhr.setRequestHeader(AUTH_HEADER, "OAuth " + Backbone.Salesforce.sessionId);
        xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-apexrest-javascript/' + API_VERSION);
        return;
      }
    };
    if (Backbone.Salesforce.sessionId == null) {
      throw 'A "sessionId" property or function must be specified';
    }
    if (!options.data && model && (method === 'create' || method === 'update')) {
      params.data = JSON.stringify(model.toJSON());
    }
    return $.ajax(_.extend(params, options));
  };
  getUrl = function(object) {
    if (!(object && object.url)) {
      return null;
    }
    if (_.isFunction(object.url)) {
      return object.url();
    } else {
      return object.url;
    }
  };
  urlError = function() {
    throw 'A "url" property or function must be specified';
  };
}).call(this);
