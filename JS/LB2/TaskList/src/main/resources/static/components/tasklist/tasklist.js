const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/tasklist.css"/>

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select>
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {
    #container;
    #allstatuses;
    #changeStatusCallback;
    #deleteTaskCallback;
    #numtasks;

    constructor() {
        super();

        this.attachShadow({ mode: "open" }); //Makes the shadow root accessible from outside the class
        this.shadowRoot.appendChild(template.content.cloneNode(true)); // Clone the template and append it to the shadow root  
        this.#container = this.shadowRoot.querySelector("#tasklist"); // Container for the list of tasks
        this.#allstatuses = [];
        this.#changeStatusCallback = null;
        this.#deleteTaskCallback = null;
        this.#numtasks = 0;
    }

    /**
     * @public
     * @param {Array} list with all possible task statuses
     */
    setStatuseslist(allstatuses) {
        this.#allstatuses = allstatuses;
    }

    /**
     * Add callback to run on change of status of a task, i.e. on change in the SELECT element
     * @public
     * @param {function} callback
     */
    addChangestatusCallback(callback) {
        this.#changeStatusCallback = callback;
    }

    /**
     * Add callback to run on click on delete button of a task
     * @public
     * @param {function} callback
     */
    addDeletetaskCallback(callback) {
        this.#deleteTaskCallback = callback;
    }

    /**
     * Add task at top in list of tasks in the view
     * @public
     * @param {Object} task - Object representing a task
     */
    showTask(task) {
        let table = this.#container.querySelector("table");
        if (!table) {
            this.#container.appendChild(tasktable.content.cloneNode(true));
            table = this.#container.querySelector("table");
        }

        const tbody = table.querySelector("tbody");
        const row = taskrow.content.cloneNode(true);

        const tr = row.querySelector("tr");
        tr.dataset.id = task.id;

        const tds = row.querySelectorAll("td");
        tds[0].textContent = task.title;
        tds[1].textContent = task.status;

        const select = row.querySelector("select");
        for (const status of this.#allstatuses) {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            select.appendChild(option);
        }
        select.addEventListener("change", () => {
            if (window.confirm(`Change status of task ${task.id} to ${select.value}?`)) {
                if (this.#changeStatusCallback) {
                    this.#changeStatusCallback(task.id, select.value);
                }
            }
        });

        const button = row.querySelector("button");
        button.addEventListener("click", () => {
            if (window.confirm(`Delete task ${task.id}?`)) {
                if (this.#deleteTaskCallback) {
                    this.#deleteTaskCallback(task.id);
                }
            }
        });

        this.#numtasks++;
        tbody.prepend(row);
    }

    /**
     * Update the status of a task in the view
     * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
     */
    updateTask(task) {
        const table = this.shadowRoot.querySelector("table");
        if (!table) return;

        const row = table.querySelector(`tr[data-id="${task.id}"]`);
        if (!row) return;

        const tds = row.querySelectorAll("td");
        tds[1].textContent = task.status;
    }

    /**
     * Remove a task from the view
     * @param {Integer} task - ID of task to remove
     */
    removeTask(id) {
        const table = this.shadowRoot.querySelector("table");
        if (!table) return;

        const row = table.querySelector(`tr[data-id="${id}"]`);
        if (!row) return;

        row.remove();
        this.#numtasks--;

        if (this.#numtasks === 0) {
            this.#container.innerHTML = "";
        }
    }

    /**
     * @public
     * @return {Number} - Number of tasks on display in view
     */
    getNumtasks() {
        return this.#numtasks;
    }
}
customElements.define('group38-tasklist', TaskList);
