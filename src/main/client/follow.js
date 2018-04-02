export default function follow(api, rootPath, relArray) {
    let root = api({
        method: 'GET',
        path: rootPath
    });

    return relArray.reduce((root, arrayItem) => {
        let rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel;
        return traverseNext(root, rel, arrayItem);
    }, root);

    function traverseNext(root, rel, arrayItem) {
        return root.then((response) => {
            if (hasEmbeddedRel(response.entity, rel)) {
                return response.entity._embedded[rel];
            }

            if (!response.entity._links) {
                return [];
            }
            
            if (typeof arrayItem === 'string') {
                return api({
                    method: 'GET',
                    path: response.entity._links[rel].href
                });
            }
            
            return api({
                method: 'GET',
                path: response.entity._links[rel].href,
                params: arrayItem.params
            });
        });
    }

    function hasEmbeddedRel(entity, rel) {
        return entity._embedded && entity._embedded.hasOwnProperty(rel);
    }
}