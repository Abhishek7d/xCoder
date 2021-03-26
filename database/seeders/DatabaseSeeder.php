<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\ServerSizeSeeder;
use Database\Seeders\RolePermissionSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // User::factory(10)->create();

        $this->call([
            //RolePermissionSeeder::class,
            ServerSizeSeeder::class
        ]);
    }
}
