<?php

namespace Database\Seeders;

use App\Http\Controllers\helpers\CommonFunctions;
use App\Models\ServerSize;
use Illuminate\Database\Seeder;

class ServerSizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sizes = CommonFunctions::makeRequest("/sizes", "GET");
        if ($sizes['status']) {
            $sizes = json_decode($sizes['data'])->sizes;
            if (count($sizes) > 0) {
                foreach ($sizes as $size) {
                    if (isset($size->slug)) {
                        if (!ServerSize::where('slug', $size->slug)->exists()) {
                            $sizeS = new ServerSize();
                            $sizeS->slug = $size->slug;
                            $sizeS->price_monthly = $size->price_monthly;
                            $sizeS->parvaty_price_monthly = ($size->price_monthly * 2);
                            $sizeS->price_hourly = $size->price_hourly;
                            $sizeS->parvaty_price_hourly = ($size->price_hourly * 2);
                            $sizeS->save();
                        } else {
                            $sizeS = ServerSize::where('slug', $size->slug)->first();
                            $sizeS->slug = $size->slug;
                            $sizeS->price_monthly = $size->price_monthly;
                            $sizeS->parvaty_price_monthly = ($size->price_monthly * 2);
                            $sizeS->price_hourly = $size->price_hourly;
                            $sizeS->parvaty_price_hourly = ($size->price_hourly * 2);
                            $sizeS->save();
                        }
                    }
                }
            }
        }
    }
}
