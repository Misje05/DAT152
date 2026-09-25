const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskbox.css"/>
    <dialog>
        <!-- Modal content -->
        <span>&times;</span>
        <div>
            <div>Title:</div>
            <div>
                <input type="text" size="25" maxlength="80"
                    placeholder="Task title" autofocus/>
            </div>
            <div>Status:</div><div><select></select></div>
        </div>
        <p><button type="submit">Add task</button></p>
    </dialog>`;

/**
 * TaskBox
 * Manages a modal dialog that lets the user enter title and status of a new task.
 * Has no knowledge of Ajax; TaskView is notified through the newtask callback
 * and decides what to do with the entered task.
 */
class TaskBox extends HTMLElement {
    #dialog;
    #titleInput;
    #statusSelect;
    #closeSpan;
    #submitButton;
    #newtaskCallback;

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#dialog = this.shadowRoot.querySelector("dialog");
        this.#titleInput = this.shadowRoot.querySelector("input");
        this.#statusSelect = this.shadowRoot.querySelector("select");
        this.#closeSpan = this.shadowRoot.querySelector("span");
        this.#submitButton = this.shadowRoot.querySelector("button");
        this.#newtaskCallback = null;

        this.#closeSpan.addEventListener("click", () => this.close());

        this.#submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            const task = {
                title: this.#titleInput.value,
                status: this.#statusSelect.value
            };
            if (this.#newtaskCallback) {
                this.#newtaskCallback(task);
            }
        });
    }

    /**
     * Opens (shows) the modal box.
     * @public
     */
    show() {
        this.#titleInput.value = "";
        this.#dialog.showModal();
    }

    /**
     * Sets the list of possible task statuses shown in the SELECT element.
     * @public
     * @param {Array} allstatuses - list of possible task statuses
     */
    setStatuseslist(allstatuses) {
        this.#statusSelect.replaceChildren();
        for (const status of allstatuses) {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            this.#statusSelect.appendChild(option);
        }
    }

    /**
     * Adds a callback to run when the user clicks the "Add task" button.
     * The callback is called with the new task, {title, status}, as parameter.
     * @public
     * @param {function} callback
     */
    addNewtaskCallback(callback) {
        this.#newtaskCallback = callback;
    }

    /**
     * Removes (closes) the modal box from the view.
     * @public
     */
    close() {
        this.#dialog.close();
    }
}
customElements.define('group38-taskbox', TaskBox);
