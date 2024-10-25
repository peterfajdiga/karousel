function mapGetOrInit<K, V>(map: Map<K, V>, key: K, defaultItem: V) {
    const item = map.get(key);
    if (item !== undefined) {
        return item;
    } else {
        map.set(key, defaultItem);
        return defaultItem;
    }
}
