<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\FarmerProfile;
use App\Models\BuyerProfile;
use App\Models\BuyerService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class RegisteredUserController extends Controller implements CreatesNewUsers
{
    /**
     * The user model class name.
     *
     * @var string
     */
    protected string $userModel = User::class;

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);
    }

    /**
     * Create a new registered user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'role' => ['required', 'in:farmer,buyer'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign role
        $user->assignRole($validated['role']);

        // Create profile based on role
        if ($validated['role'] === 'farmer') {
            FarmerProfile::create([
                'user_id' => $user->id,
            ]);
        } elseif ($validated['role'] === 'buyer') {
            $buyer = BuyerProfile::create([
                'user_id' => $user->id,
                'business_name' => $validated['name'] . "'s Business",
                'phone' => '',
                'verification_status' => 'pending',
            ]);

            BuyerService::create([
                'buyer_profile_id' => $buyer->id,
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        // Redirect based on role
        if ($validated['role'] === 'buyer') {
            return redirect('/buyer/profile')->with('success', 'Selamat datang! Silakan lengkapi profil bisnis Anda.');
        }

        return redirect('/farmer/dashboard')->with('success', 'Selamat datang di TANI TECH!');
    }
}
