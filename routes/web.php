<?php

use App\Http\Controllers\BuyerController;
use App\Http\Controllers\Farmer\DashboardController as FarmerDashboardController;
use App\Http\Controllers\Farmer\FavoriteController;
use App\Http\Controllers\Farmer\SaleRequestController;
use App\Http\Controllers\Farmer\ReviewController;
use App\Http\Controllers\Farmer\TransactionController;
use App\Http\Controllers\Buyer\DashboardController as BuyerDashboardController;
use App\Http\Controllers\Buyer\ProfileController as BuyerProfileController;
use App\Http\Controllers\Buyer\CommodityController;
use App\Http\Controllers\Buyer\PriceController;
use App\Http\Controllers\Buyer\SalesController;
use App\Http\Controllers\Buyer\TransactionController as BuyerTransactionController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\Admin\BuyerManagementController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Public\BuyerController as PublicBuyerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/buyers', [PublicBuyerController::class, 'index'])->name('buyers.index');
Route::get('/buyers/{buyer}', [PublicBuyerController::class, 'show'])->name('buyers.show');

/*
|--------------------------------------------------------------------------
| Legal Routes
|--------------------------------------------------------------------------
*/
Route::get('/privacy-policy', function () {
    return inertia('legal/privacy-policy');
})->name('legal.privacy');
Route::get('/terms-of-service', function () {
    return inertia('legal/terms-of-service');
})->name('legal.terms');

/*
|--------------------------------------------------------------------------
| Guest Routes (No Auth Required)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    // Already handled by public routes above
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isBuyer()) {
            return redirect()->route('buyer.dashboard');
        }

        if ($user->isFarmer()) {
            return redirect()->route('farmer.dashboard');
        }

        return redirect()->route('home');
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Farmer Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:farmer'])->prefix('farmer')->name('farmer.')->group(function () {
        Route::get('/dashboard', [FarmerDashboardController::class, 'index'])->name('dashboard');
        Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
        Route::post('/favorites/{buyer}', [FavoriteController::class, 'store'])->name('favorites.store');
        Route::delete('/favorites/{buyer}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');
        Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
        Route::delete('/transactions/{transaction}/withdraw', [TransactionController::class, 'withdraw'])->name('transactions.withdraw');
        Route::get('/reviews/{transaction}/create', [ReviewController::class, 'create'])->name('reviews.create');
        Route::post('/reviews/{transaction}', [ReviewController::class, 'store'])->name('reviews.store');
    });

    Route::post('/sale-request', [SaleRequestController::class, 'store'])->name('sale-request.store');

    /*
    |--------------------------------------------------------------------------
    | Buyer Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {
        Route::get('/dashboard', [BuyerDashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', [BuyerProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [BuyerProfileController::class, 'update'])->name('profile.update');
        Route::get('/commodities', [CommodityController::class, 'index'])->name('commodities.index');
        Route::post('/commodities', [CommodityController::class, 'store'])->name('commodities.store');
        Route::put('/commodities/{commodity}', [CommodityController::class, 'update'])->name('commodities.update');
        Route::delete('/commodities/{commodity}', [CommodityController::class, 'destroy'])->name('commodities.destroy');
        Route::post('/commodities/{commodity}/grades', [CommodityController::class, 'addGrade'])->name('commodities.grades.store');
        Route::put('/grades/{grade}', [CommodityController::class, 'updateGrade'])->name('commodities.grades.update');
        Route::delete('/grades/{grade}', [CommodityController::class, 'deleteGrade'])->name('commodities.grades.destroy');
        Route::get('/prices', [PriceController::class, 'index'])->name('prices.index');
        Route::put('/prices/{grade}', [PriceController::class, 'update'])->name('prices.update');
        Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
        Route::put('/sales/{saleRequest}', [SalesController::class, 'update'])->name('sales.update');
        Route::put('/transactions/{transaction}/confirm', [BuyerTransactionController::class, 'confirm'])->name('transactions.confirm');
        Route::put('/transactions/{transaction}/reject', [BuyerTransactionController::class, 'reject'])->name('transactions.reject');
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Verifications
        Route::get('/verifications', [VerificationController::class, 'index'])->name('verifications.index');
        Route::put('/verifications/{buyer}', [VerificationController::class, 'update'])->name('verifications.update');

        // Buyer Management
        Route::get('/buyers', [BuyerManagementController::class, 'index'])->name('buyers.index');
        Route::get('/buyers/{buyer}', [BuyerManagementController::class, 'show'])->name('buyers.show');
        Route::post('/buyers/{buyer}/suspend', [BuyerManagementController::class, 'suspend'])->name('buyers.suspend');
        Route::post('/buyers/{buyer}/unsuspend', [BuyerManagementController::class, 'unsuspend'])->name('buyers.unsuspend');
        Route::post('/buyers/{buyer}/toggle-active', [BuyerManagementController::class, 'toggleActive'])->name('buyers.toggle-active');

        // Reports
        Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/{report}', [\App\Http\Controllers\Admin\ReportController::class, 'show'])->name('reports.show');
        Route::put('/reports/{report}', [\App\Http\Controllers\Admin\ReportController::class, 'update'])->name('reports.update');
    });
});

require __DIR__.'/settings.php';
