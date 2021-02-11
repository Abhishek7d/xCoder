<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WebSiteController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BlockStorageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['prefix' => 'api'], function () {
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/register', [UserController::class, 'register']);
    Route::get('/resend', [UserController::class, 'resend']);
    Route::get('/check', [UserController::class, 'checkLogin']);
    Route::get('email/verify/{id}', [UserController::class, 'verify'])->name('verification.verify');
    Route::post('/reset', [UserController::class, 'reset']);
    Route::post('/reset/password', [UserController::class, 'resetPassword']);
    Route::post('/change/password', [UserController::class, 'changePassword']);
    Route::get('password/reset/{token}', [UserController::class, 'returnToFrontEnd'])->name('password.reset');
    Route::post('/logout', [UserController::class, 'logout']);

    Route::get('completed/{server_id}/{server_hash}', [DashboardController::class, 'serverCompleted']);

    Route::group(['middleware' => 'checkAuth'], function () {
        //Route::post('/logout', [UserController::class, 'logout']);

        //projects
        Route::post('/project', [DashboardController::class, 'createProject']);
        Route::get('/projects', [DashboardController::class, 'projects']);


        //droplets
        Route::get('/sizes', [DashboardController::class, 'availableSizes']);
        Route::get('/regions', [DashboardController::class, 'availableRegions']);
        Route::post('/droplet', [DashboardController::class, 'createDroplet']);
        Route::post('/droplet/{id}', [DashboardController::class, 'dropletAction']);
        Route::get('/droplets', [DashboardController::class, 'droplets']);

        //application
        Route::get('/application', [WebSiteController::class, 'showDomains']);
        Route::post('/application/new', [WebSiteController::class, 'addDomain']);
        Route::post('/application/{application}/update-domain', [WebSiteController::class, 'updateDomainName']);
        Route::post('/application/{application}/add-ssl', [WebSiteController::class, 'addSSLToDomain']);
        Route::post('/application/{application}/remove-ssl', [WebSiteController::class, 'removeSSLToDomain']);
        Route::post('/application/{application}/add-ftp', [WebSiteController::class, 'addFTPToApplication']);
        Route::post('/application/{application}/delete-ftp', [WebSiteController::class, 'removeFTPToApplication']);
        Route::post('/application/{application}/change-ftp-pass', [WebSiteController::class, 'changeFTPPassword']);
        Route::post('/application/{application}', [WebSiteController::class, 'removeDomain']);

        //services
        Route::get('/server/{server}', [ServiceController::class, 'getStatus']);
        Route::post('/server/{server}', [ServiceController::class, 'setService']);
        Route::get('/resouces/{server}', [ServiceController::class, 'getResources']);

        //cronjob
        Route::get('/cron/{server}', [ServiceController::class, 'getCronjobs']);
        Route::post('/cron/{server}', [ServiceController::class, 'addCronjob']);
        Route::post('/cron/{server}/{job}', [ServiceController::class, 'setCronjob']);

        //block storage
        Route::post('/storage', [BlockStorageController::class, 'createBlockStorage']);
        Route::post('/storage/resize', [BlockStorageController::class, 'resizeBlockStorage']);
        Route::post('/storage/delete', [BlockStorageController::class, 'deleteBlockStorage']);

        // Notifications
        Route::get('notifications', [DashboardController::class, 'notification']);
    });
});
Route::view("/{path?}", "app");
Route::view("/{path?}/{subpath?}", "app");
Route::view("/{path?}/{subpath?}/{subsubpath?}", "app");

// Route::any('/', [UserController::class, 'default']);
