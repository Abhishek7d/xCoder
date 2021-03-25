<?php

namespace Database\Seeders;

use App\Models\AdminUsers;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        if (!AdminUsers::where('email', 'admin@parvaty.me')->exists()) {
            $user = new AdminUsers();
            $user->name = "Super Admin";
            $user->email = "admin@parvaty.me";
            $user->email_verified_at = Carbon::now();
            $user->password = Hash::make("parvaty@me");
            $user->access_tokens = json_encode([]);
            $user->save();
        } else {
            $user = AdminUsers::where('email', 'admin@parvaty.me')->first();
        }
        // Create Role
        if (!Role::where('name', 'super-admin')->exists()) {
            $role = Role::create(['name' => 'super-admin', 'guard_name' => 'web']);
        } else {
            $role = Role::where('name', 'super-admin')->first();
        }

        $user->assignRole($role);

        // Create Permissions
        DB::table('permissions')->delete();
        DB::table('permissions')->insert(
            [
                // Access admin panel
                ['name' => 'access-admin-panel', 'guard_name' => 'web'],

                // Dashboard
                ['name' => 'dashboard.view', 'guard_name' => 'web'],

                // Settings
                ['name' => 'dashboard.settings.view', 'guard_name' => 'web'],
                ['name' => 'dashboard.settings.edit', 'guard_name' => 'web'],

                // Notifications
                ['name' => 'dashboard.notifications.view', 'guard_name' => 'web'],

                // Payments
                ['name' => 'dashboard.payments.view', 'guard_name' => 'web'],

                // Dashboard Users
                ['name' => 'dashboard.users.view', 'guard_name' => 'web'],
                ['name' => 'dashboard.users.edit', 'guard_name' => 'web'],
                ['name' => 'dashboard.users.delete', 'guard_name' => 'web'],
                ['name' => 'dashboard.users.create', 'guard_name' => 'web'],
                ['name' => 'dashboard.users.changePassword', 'guard_name' => 'web'],

                // Droplets Users
                ['name' => 'droplets.users.create', 'guard_name' => 'web'],
                ['name' => 'droplets.users.edit', 'guard_name' => 'web'],
                ['name' => 'droplets.users.view', 'guard_name' => 'web'],
                ['name' => 'droplets.users.delete', 'guard_name' => 'web'],
                ['name' => 'droplets.users.banUser', 'guard_name' => 'web'],
                ['name' => 'droplets.users.changePassword', 'guard_name' => 'web'],

                // Projects
                ['name' => 'droplets.projects.view', 'guard_name' => 'web'],
                ['name' => 'droplets.projects.create', 'guard_name' => 'web'],
                ['name' => 'droplets.projects.delete', 'guard_name' => 'web'],
                ['name' => 'droplets.projects.edit', 'guard_name' => 'web'],

                // Servers
                ['name' => 'droplets.servers.view', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.edit', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.create', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.delete', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.changeStatus', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.addStorage', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.editStorage', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.deleteStorage', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.addApplication', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.editApplication', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.deleteApplication', 'guard_name' => 'web'],
                ['name' => 'droplets.servers.modifyApplicationSettings', 'guard_name' => 'web'],

                // Sizes / Prices
                ['name' => 'droplets.sizes.view', 'guard_name' => 'web'],
                ['name' => 'droplets.sizes.edit', 'guard_name' => 'web'],
                ['name' => 'droplets.sizes.create', 'guard_name' => 'web'],
                ['name' => 'droplets.sizes.delete', 'guard_name' => 'web'],
                ['name' => 'droplets.sizes.modifyPrices', 'guard_name' => 'web'],

                // Invoices
                ['name' => 'droplets.invoices.create', 'guard_name' => 'web'],
                ['name' => 'droplets.invoices.edit', 'guard_name' => 'web'],
                ['name' => 'droplets.invoices.delete', 'guard_name' => 'web'],
                ['name' => 'droplets.invoices.view', 'guard_name' => 'web'],



            ]
        );
        $role->syncPermissions(Permission::all());
    }
}
