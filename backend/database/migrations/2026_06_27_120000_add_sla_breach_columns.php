<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->timestamp('sla_breached_at')->nullable()->after('sla_breached');
            $table->timestamp('first_response_due_at')->nullable()->after('sla_breached_at');
            $table->timestamp('first_responded_at')->nullable()->after('first_response_due_at');
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn(['sla_breached_at', 'first_response_due_at', 'first_responded_at']);
        });
    }
};
