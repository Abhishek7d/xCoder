<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Storage;
use App\Models\StorageChanges;

class CreateStorageChangesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('storage_changes', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('storage_id');
            $table->string('size');
            $table->timestamps();
        });

        $allStorage = Storage::withTrashed()->get();
        if ($allStorage->count() > 0) {
            foreach ($allStorage as $storage) {
                if (!StorageChanges::where([
                    ['storage_id', $storage->id],
                    ['size', $storage->size],
                    ['created_at', $storage->created_at],
                    ['updated_at', $storage->updated_at],
                ])->exists()) {
                    $changes = new StorageChanges();
                    $changes->storage_id = $storage->id;
                    $changes->size = $storage->size;
                    $changes->created_at = $storage->created_at;
                    $changes->updated_at = $storage->created_at;
                    $changes->save();
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('storage_changes');
    }
}
