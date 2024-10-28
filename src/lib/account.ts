import axios from "axios";
import { EmailMessage, SyncResponse, SyncUpdatedResponse } from "./types";

export class Account {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    // private async startSync(daysWithin: number): Promise<SyncResponse> {
    private async startSync() {
        const response = await axios.post<SyncResponse>( 'https://api.aurinko.io/v1/email/sync', {}, {
            headers: { 
                Authorization: `Bearer ${this.token}` 
            }, 
            params: {
                daysWithin: 2,
                bodyType: 'html'
            }
        });
        return response.data;
    }


    // async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }): Promise<SyncUpdatedResponse> {
    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }) {
        // console.log('getUpdatedEmails', { deltaToken, pageToken });
        let params: Record<string, string> = {};
        if (deltaToken) params.deltaToken = deltaToken;
        if (pageToken) params.pageToken = pageToken;
        const response = await axios.get<SyncUpdatedResponse>('https://api.aurinko.io/v1/email/sync/updated', {
            headers: { 
                Authorization: `Bearer ${this.token}` 
            },
            params,
        });
        return response.data;
    }


    async performInitialSync() {
        try {
            // Start the sync process
            // const daysWithin = 3
            // let syncResponse = await this.startSync(daysWithin); // Sync emails from the last 7 days
            let syncResponse = await this.startSync(); // Sync emails from the last 7 days

            // Wait until the sync is ready
            while (!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                // syncResponse = await this.startSync(daysWithin);
                syncResponse = await this.startSync();
            }
            // console.log('Sync is ready. Tokens:', syncResponse);

            // Perform initial sync of updated emails OR Get the bookmark delta token
            let storedDeltaToken: string = syncResponse.syncUpdatedToken
            let updatedResponse = await this.getUpdatedEmails({ deltaToken: storedDeltaToken });
            // console.log('updatedResponse', updatedResponse)
            if (updatedResponse.nextDeltaToken) {       // Means Sync has completed
                storedDeltaToken = updatedResponse.nextDeltaToken
            }
            let allEmails: EmailMessage[] = updatedResponse.records;

            // Fetch all pages if there are more Emails
            while (updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken });
                allEmails = allEmails.concat(updatedResponse.records);
                if (updatedResponse.nextDeltaToken) {   // Sync has ended
                    storedDeltaToken = updatedResponse.nextDeltaToken
                }
            }
            console.log('Initial sync complete. Total emails:', allEmails.length);


            // Store the latest OR nextDeltaToken for future incremental syncs
            // Example of using the stored delta token for an incremental sync
            // await this.performIncrementalSync(storedDeltaToken);

            return {
                emails: allEmails,
                deltaToken: storedDeltaToken,
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error during sync:', JSON.stringify(error.response?.data, null, 2));
            } else {
                console.error('Error during sync:', error);
            }
        }
    }


}