<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\GlobalSettings\SizeController;
use App\Http\Controllers\GlobalSettings\ColorController;
use App\Http\Controllers\GlobalSettings\CategoryController;
use App\Http\Controllers\GlobalSettings\OrderTypeController;
use App\Http\Controllers\GlobalSettings\SizeValueController;
use App\Http\Controllers\GlobalSettings\HeelHeightController;

Route::get('/', function () {
    return Redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('/settings_colors', ColorController::class);
    Route::resource('/settings_categories', CategoryController::class);
    Route::resource('/settings_heel-heights', HeelHeightController::class);
    // Route::resource('/settings_order-types', OrderTypeController::class);
    Route::resource('/settings_sizes', SizeController::class);
    Route::resource('/settings_size_values', SizeValueController::class);

});

Route::get('/settings', function () {
    return Inertia::render('Settings/Page');
})->middleware(['auth', 'role:admin'])->name('settings');

require __DIR__.'/auth.php';
