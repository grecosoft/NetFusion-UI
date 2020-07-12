import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ComponentFormState} from 'src/app/common/guards/form-state/form-state.guard';
import {ConnectionService} from '../../../services/ConnectionService';
import {ApiConnection} from '../../../types/connection-types';
import {ConfirmSettings, ConfirmResponseTypes} from 'src/app/common/dialogs/confirmation/types';
import {ConfirmationService} from 'src/app/common/dialogs/confirmation/ConfirmationService';

// Component listing currently configured connections to REST/HAL based APIs.
// Also allows creation, editing, and deleting of connections.
@Component({
    styleUrls: ['connections.component.scss'],
    templateUrl: 'connections.component.html',
})
export class ConnectionsComponent implements OnInit, ComponentFormState {

    // Connection Editing:
    public connectionEntry: FormGroup;
    public existingConnection: ApiConnection;
    private isAddingNewConn = false;

    // Connection Listing:
    public connectionColumns = ['name', 'address', 'actions', 'status'];
    public connections: MatTableDataSource<ApiConnection>;

    public constructor(
        private formBuilder: FormBuilder,
        private connectionService: ConnectionService,
        private confirmation: ConfirmationService) {
    }

    public ngOnInit() {
        this.createEntry();
        this.connections = new MatTableDataSource(this.connectionService.connections);
    }

    private createEntry() {

        this.connectionEntry = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)] ],
            address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)] ],
            entryPath: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)] ],
            logPath: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)] ],
            docPath: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)] ]
        });
    }

    public isInputInvalid(fieldName: string): boolean {
        return this.connectionEntry.get(fieldName).invalid;
    }

    // Implementation of ComponentFormState interface.  The state of the returned
    // FormGroup is determined if navigation away from the component's view is allowed.
    public formGroupToValidate = () => this.connectionEntry;

    private resetEntryState() {
        this.existingConnection = null;
        this.isAddingNewConn = false;
        this.connectionEntry.reset();
    }

    public addConnection() {
        this.isAddingNewConn = true;
        this.connectionEntry.reset();
    }

    public editConnection(connection: ApiConnection) {
      connection.succeeded = null; // Reset the validation status.
      this.existingConnection = connection;
      this.connectionEntry.reset(this.existingConnection);
    }

    public cancelEdit() {
        this.resetEntryState();
    }

    public deleteConnection(connection: ApiConnection) {

        const confirmation = new ConfirmSettings(
            'Delete Connection',
            `Are you sure you want to delete connection: ${connection.name}?`);

        confirmation.confirmText = 'Delete';

        this.confirmation.verifyAction(confirmation).subscribe((answer) => {
            if (answer === ConfirmResponseTypes.ActionConfirmed) {

               this.connectionService.deleteConnection(connection);
               this.connections.data = this.connectionService.connections;
            }
        });
    }

    public saveConnection() {
        const conn = this.populateConnection();

        this.connectionService.saveConnection(conn);
        this.resetEntryState();
    }

    public copyConnection(connection: ApiConnection) {
      this.isAddingNewConn = true;
      this.connectionEntry.reset(connection);
    }

    // Update existing connection being edited for the form state or
    // create new connection.
    private populateConnection(): ApiConnection {
      const formModel = this.connectionEntry.value;
      return Object.assign(this.existingConnection || {}, formModel);
    }

    public testConnections() {
        if (this.isEditingConnection && this.connectionEntry.valid) {

          this.existingConnection = this.populateConnection();
          this.connectionService.testConnection(this.existingConnection);
          return;
        }

        this.connectionService.testConnections();
    }

    // Determines if no connections exist.
    public get showNoConnections() {
        return this.connectionService.connections.length === 0;
    }

    // Determines if the list of connections should be displayed.
    public get showConnectionListing() {
        return this.connectionService.connections.length > 0 && !this.isEditingConnection;
    }

    // Determines is a the current connection is being edited or added.
    public get isEditingConnection(): boolean {
        return this.connectionService.connections.length === 0 || this.existingConnection != null || this.isAddingNewConn;
    }

    // Determines if the test button on the toolbar should be disabled.
    public get isTestDisabled(): boolean {
      return this.isEditingConnection && this.connectionEntry.invalid;
    }

    public get displayCancel() {
        return this.isEditingConnection && this.connectionService.connections.length > 0;
    }
}
