<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_activities', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('action');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_activities', function (Blueprint $table) {
            $table->dropColumn('meta');
        });
    }
};
