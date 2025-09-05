type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
}

class ApiClient {
    private async fetch<T>(endPoint: string, options: FetchOptions = {} ) : Promise<T> {
        const { method = "GET", body, headers = {} } = options;
        
        const defaultHeaders = {
            "Content-Type": "application/json", 
            ...headers,
        }
        
        const response = await fetch(`/api/${endPoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if(!response.ok) throw new Error(await response.text());
        
        return response.json();
    };

    // calling API 
    async signUp(){
        return this.fetch("users", {
            method: "POST",
            // body: data,
        })
    }


};

export const apiClient = new ApiClient();