<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\FarmerProfile;
use App\Models\BuyerProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $farmer;
    protected User $buyer;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Create users with roles
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->buyer = User::factory()->create();
        $this->buyer->assignRole('buyer');
        BuyerProfile::create(['user_id' => $this->buyer->id, 'business_name' => 'Test Buyer', 'phone' => '081234567890']);

        $this->farmer = User::factory()->create();
        $this->farmer->assignRole('farmer');
        FarmerProfile::create(['user_id' => $this->farmer->id]);
    }

    /**
     * Test that farmer cannot access buyer dashboard.
     */
    public function test_farmer_cannot_access_buyer_dashboard(): void
    {
        $response = $this->actingAs($this->farmer)->get('/buyer/dashboard');
        $response->assertStatus(403);
    }

    /**
     * Test that buyer cannot access farmer dashboard.
     */
    public function test_buyer_cannot_access_farmer_dashboard(): void
    {
        $response = $this->actingAs($this->buyer)->get('/farmer/dashboard');
        $response->assertStatus(403);
    }

    /**
     * Test that farmer cannot access admin dashboard.
     */
    public function test_farmer_cannot_access_admin_dashboard(): void
    {
        $response = $this->actingAs($this->farmer)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    /**
     * Test that buyer cannot access admin dashboard.
     */
    public function test_buyer_cannot_access_admin_dashboard(): void
    {
        $response = $this->actingAs($this->buyer)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    /**
     * Test that admin can access admin dashboard.
     */
    public function test_admin_can_access_admin_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test that unauthenticated user is redirected to login.
     */
    public function test_unauthenticated_user_redirected_to_login(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    /**
     * Test that farmer can access farmer dashboard.
     */
    public function test_farmer_can_access_farmer_dashboard(): void
    {
        $response = $this->actingAs($this->farmer)->get('/farmer/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test that buyer can access buyer dashboard.
     */
    public function test_buyer_can_access_buyer_dashboard(): void
    {
        $response = $this->actingAs($this->buyer)->get('/buyer/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test that public routes are accessible without auth.
     */
    public function test_public_routes_accessible(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $response = $this->get('/buyers');
        $response->assertStatus(200);
    }
}
