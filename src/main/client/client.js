import rest from 'rest';
import defaultRequest from 'rest/interceptor/defaultRequest';
import errorCode from 'rest/interceptor/errorCode';
import mime from 'rest/interceptor/mime';
import uriTemplateInterceptor from 'rest/interceptor/template';
import baseRegistry from 'rest/mime/registry';
import hal from 'rest/mime/type/application/hal';

import uriListConverter from './api/uriListConverter';


let registry = baseRegistry.child();

registry.register('test/uri-list', uriListConverter);
registry.register('application/hal+json', hal);

export default rest
    .wrap(mime, { registry })
    .wrap(uriTemplateInterceptor)
    .wrap(errorCode)
    .wrap(defaultRequest, { headers: { 'Accept': 'application/hal+json' }});