<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->string('banner')->nullable()->after('photo');
            $table->string('location', 120)->nullable()->after('situation');
            $table->string('linkedin_url', 2048)->nullable()->after('bio');
            $table->string('portfolio_url', 2048)->nullable()->after('linkedin_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn(['banner', 'location', 'linkedin_url', 'portfolio_url']);
        });
    }
};
