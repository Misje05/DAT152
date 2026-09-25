import "../tasklist/tasklist.js";
import "../taskbox/taskbox.js";

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${new URL('taskview.css', import.meta.url)}">
    <h1>Tasks</h1>
    <div id="message"><p>Waiting for server data.</p></div>
    <div id="newtask">
        <button type="button" disabled>New task</button>
    </div>
    <br>
    <!-- The task list -->
    <group38-tasklist></group38-tasklist>

    <!-- The Modal -->
    <group38-taskbox></group38-taskbox>`;

/**
 * TaskView
 * Top level component of the task list application. Fetches statuses and tasks
 * from the server with the Fetch API and coordinates the TaskList and TaskBox
 * components through their public APIs. TaskList and TaskBox have no knowledge
 * of Ajax; all use of fetch is done here.
 */
class TaskView extends HTMLElement {
    #serviceUrl;
    #tasklist;
    #taskbox;
    #message;
    #newtaskButton;

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#serviceUrl = this.dataset.serviceurl;
        this.#tasklist = this.shadowRoot.querySelector("group38-tasklist");
        this.#taskbox = this.shadowRoot.querySelector("group38-taskbox");
        this.#message = this.shadowRoot.querySelector("#message");
        this.#newtaskButton = this.shadowRoot.querySelector("#newtask button");

        this.#newtaskButton.addEventListener("click", () => this.#taskbox.show());

        this.#tasklist.addChangestatusCallback(
            (id, status) => this.#changeTaskStatus(id, status)
        );
        this.#tasklist.addDeletetaskCallback(
            (id) => this.#deleteTask(id)
        );
        this.#taskbox.addNewtaskCallback(
            (task) => this.#addTask(task)
        );
    }

    connectedCallback() {
        this.#init();
    }

    /**
     * Loads statuses and the task list from the server and populates the view.
     * @private
     */
    async #init() {
        const allstatuses = await this.#fetchAllstatuses();
        this.#tasklist.setStatuseslist(allstatuses);
        this.#taskbox.setStatuseslist(allstatuses);

        const tasks = await this.#fetchTasklist();
        for (const task of tasks) {
            this.#tasklist.showTask(task);
        }

        this.#newtaskButton.disabled = false;
        this.#showMessage();
    }

    /**
     * @private
     * @return {Array} list of possible task statuses, empty array on failure
     */
    async #fetchAllstatuses() {
        try {
            const response = await fetch(`${this.#serviceUrl}/allstatuses`);
            const data = await response.json();
            if (data.responseStatus) {
                return data.allstatuses;
            }
        } catch (error) {
            console.error(error);
        }
        return [];
    }

    /**
     * @private
     * @return {Array} list of tasks stored on the server, empty array on failure
     */
    async #fetchTasklist() {
        try {
            const response = await fetch(`${this.#serviceUrl}/tasklist`);
            const data = await response.json();
            if (data.responseStatus) {
                return data.tasks;
            }
        } catch (error) {
            console.error(error);
        }
        return [];
    }

    /**
     * Sends a new task to the server, and shows the task in the list on success.
     * @private
     * @param {Object} task - {title, status} entered by the user in TaskBox
     */
    async #addTask(task) {
        try {
            const response = await fetch(`${this.#serviceUrl}/task`, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(task)
            });
            const data = await response.json();
            if (data.responseStatus) {
                this.#tasklist.showTask(data.task);
                this.#taskbox.close();
                this.#showMessage();
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Updates the status of a task on the server, and in the view on success.
     * @private
     * @param {Number} id - id of the task to update
     * @param {String} status - new status of the task
     */
    async #changeTaskStatus(id, status) {
        try {
            const response = await fetch(`${this.#serviceUrl}/task/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ status: status })
            });
            const data = await response.json();
            if (data.responseStatus) {
                this.#tasklist.updateTask({ id: data.id, status: data.status });
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Deletes a task on the server, and removes it from the view on success.
     * @private
     * @param {Number} id - id of the task to delete
     */
    async #deleteTask(id) {
        try {
            const response = await fetch(`${this.#serviceUrl}/task/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.responseStatus) {
                this.#tasklist.removeTask(data.id);
                this.#showMessage();
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Updates the message element with the current number of tasks in the list.
     * @private
     */
    #showMessage() {
        const numtasks = this.#tasklist.getNumtasks();
        const text = numtasks === 0
            ? "No tasks were found."
            : `Found ${numtasks} task${numtasks === 1 ? "" : "s"}.`;

        const p = document.createElement("p");
        p.textContent = text;
        this.#message.replaceChildren(p);
    }
}
customElements.define('group38-taskview', TaskView);
