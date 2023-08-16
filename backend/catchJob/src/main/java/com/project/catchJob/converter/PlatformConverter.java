package com.project.catchJob.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Converter
public class PlatformConverter implements AttributeConverter<List<String>, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        String jsonString = "";
        try {
            jsonString = objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return jsonString;
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        List<String> platforms = new ArrayList<>();
        try {
            platforms = objectMapper.readValue(dbData, ArrayList.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return platforms;
    }
}
