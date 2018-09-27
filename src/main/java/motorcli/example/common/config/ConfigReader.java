package motorcli.example.common.config;

import java.util.HashMap;
import java.util.Map;

public class ConfigReader {

    private static ConfigReader instance = new ConfigReader();

    private Map<String, Object> configMap = new HashMap<>();

    private ConfigReader() {}

    public static ConfigReader getInstance() {
        return instance;
    }

    public void add(String key, Object value) {
        configMap.put(key, value);
    }

    public Object get(String key) {
        return configMap.get(key);
    }
}
