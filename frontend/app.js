function taskApp() {
    return {
        tasks: [],
        newTask: { title: '', description: '', priority: 'Low' },
        isPopupOpen: false,
        selectedTask: {},
        isEditMode: false,
        isConfirmPopupOpen: false,
        hasFetched: false, // Tambahkan variabel untuk mengecek apakah fetch sudah dilakukan

        async fetchTasks() {
            if (!this.hasFetched) { // Hanya fetch jika belum dilakukan
                this.hasFetched = true; // Tandai bahwa fetch sudah dilakukan
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/tasks');
                    this.tasks = await response.json();
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            }
        },

        init() {
            this.fetchTasks(); // Panggil fetchTasks di awal inisialisasi
        },

        async addTask() {
            const task = {
                title: this.newTask.title,
                description: this.newTask.description,
                priority: this.newTask.priority,
                completed: false
            };

            try {
                const response = await fetch('http://127.0.0.1:8000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(task),
                });

                if (response.ok) {
                    const createdTask = await response.json();
                    this.tasks.push(createdTask);
                    this.newTask = { title: '', description: '', priority: 'Low' };
                } else {
                    console.error('Error adding task:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        },

        async completeTask(id) {
            const task = this.tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                await this.saveTasks();
            }
        },

        async saveTasks() {
            try {
                await Promise.all(this.tasks.map(async (task) => {
                    await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(task),
                    });
                }));
            } catch (error) {
                console.error('Error saving tasks:', error);
            }
        },

        viewTask(task) {
            this.selectedTask = task;
            this.isPopupOpen = true;
            this.isEditMode = false;
        },

        editTask(task) {
            this.selectedTask = { ...task };
            this.isPopupOpen = true;
            this.isEditMode = true;
        },

        async updateTask() {
            const index = this.tasks.findIndex(t => t.id === this.selectedTask.id);
            if (index !== -1) {
                this.tasks[index] = this.selectedTask;

                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${this.selectedTask.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.selectedTask),
                    });

                    if (response.ok) {
                        this.isPopupOpen = false;
                    } else {
                        console.error('Error updating task:', response.statusText);
                    }
                } catch (error) {
                    console.error('Network error:', error);
                }
            }
        },

        confirmDelete(task) {
            this.selectedTask = task;
            this.isConfirmPopupOpen = true;
        },

        async deleteTask(id) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    this.tasks = this.tasks.filter(task => task.id !== id);
                    this.isConfirmPopupOpen = false;
                } else {
                    console.error('Error deleting task:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        },

        closePopup() {
            this.isPopupOpen = false;
        },

        closeConfirmPopup() {
            this.isConfirmPopupOpen = false;
        }
    };
}