package com.project.catchJob.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Converter
public class CrewConverter implements AttributeConverter<Map<String, Integer>, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Integer> attribute) {
        String jsonString = "";
        try {
            jsonString = objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return jsonString;
    }

    @Override
    public Map<String, Integer> convertToEntityAttribute(String dbData) {
        Map<String, Integer> crew = new HashMap<>();
        try {
            crew = objectMapper.readValue(dbData, HashMap.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return crew;
    }
}
