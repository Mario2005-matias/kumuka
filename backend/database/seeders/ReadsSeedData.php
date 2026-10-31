<?php

namespace Database\Seeders;

trait ReadsSeedData
{
    /**
     * Decode a JSON file from database/seeders/data.
     *
     * @return list<array<string, mixed>>
     */
    protected function seedData(string $name): array
    {
        return json_decode(
            file_get_contents(database_path("seeders/data/{$name}.json")),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }
}
