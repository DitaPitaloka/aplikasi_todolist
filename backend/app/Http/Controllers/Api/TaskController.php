<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return Task::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'completed' => 'boolean',
        ]);

        $task = Task::create($request->all());

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return $task;
    }

    public function update(Request $request, $id)
    {
        // Cari Task berdasarkan ID
        $task = Task::find($id);

        // Jika Task tidak ditemukan, kirim respons error
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        // Validasi data
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'priority' => 'in:Low,Medium,High',
            'completed' => 'boolean',
        ]);

        // Update data task
        $task->update($request->all());

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Berhasil menghapus kegiatan']);
    }
}