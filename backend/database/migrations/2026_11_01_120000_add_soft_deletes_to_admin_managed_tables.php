<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Records deleted in the admin panel are archived first so they can be restored;
 * only a second, explicit action removes them for good.
 */
return new class extends Migration
{
    /**
     * @var list<string>
     */
    private array $tables = ['users', 'trails', 'opportunities', 'experiences', 'companies', 'quick_learnings', 'guides'];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->tables as $name) {
            Schema::table($name, function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->tables as $name) {
            Schema::table($name, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
