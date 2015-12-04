import apiServices from '../api';

apiServices.factory('collections', ['mediaApi', function (mediaApi) {
    // TODO: Rx?
    let collections;

    function getCollections() {
        if(! collections) {
            collections = mediaApi.root.follow('collections').get().
                then(collectionsService => collectionsService.follow('collections').get());
        }
        return collections;
    }

    function removeCollection(collection) {
        return collection.perform('delete');
    }

    function addCollection(newCollectionPath) {
        return mediaApi.root.follow('collections').post({data: newCollectionPath});
    }

    function addChildTo(node, childName) {
        return node.perform('add-child', {body: {data: childName}}).then(childResource => {
            return node.data.children = [childResource].concat(node.data.children);
        });
    }

    function isDeletable(node) {
        return node.getAction('remove').then(d => angular.isDefined(d));
    }

    function removeFromList(child, list) {
        return child.perform('remove').then(() => {
            // Mutating the array p_q
            const i = list.indexOf(child);
            list.splice(i, 1);
        });
    }

    return {
        getCollections,
        removeCollection,
        addCollection,
        addChildTo,
        isDeletable,
        removeFromList
    };
}]);
