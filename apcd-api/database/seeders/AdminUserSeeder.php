<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@apcd.com'], // si déjà présent, on le met à jour
            [
                'full_name'     => 'Super Admin',
                'email'         => 'admin@apcd.com',
                'country_code'  => '+237',
                'phone_number'  => '690000000',
                'address'       => 'Siège APCD',
                'postal_code'   => '12345',
                'profession'    => 'Administrateur',
                'gender'        => 'male',
                'invitation_code' => null,
                'role'          => 'admin',
                'password'      => Hash::make('admin123'), // 🔑 mot de passe par défaut
            ]
        );
    }
}
