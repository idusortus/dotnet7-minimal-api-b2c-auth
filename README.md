# dotnet7-minimal-api-b2c-auth
Use Azure B2C to protect a minimal Dotnet WebAPI &amp; Test with Postman

- Create B2C Tenant  (This takes a while. Start it and circle back)
  
  # Visual Studio Code Setup
  Environment notes:  
  dotnet --list-sdks  
  > 	7.0.102 [C:\Program Files\dotnet\sdk]  
	   dotnet --list-runtimes  
	> 	  Microsoft.AspNetCore.App 7.0.2, Microsoft.NETCore.App 7.0.2, Microsoft.WindowsDesktop.App 7.0.2  
	>   Visual Studio Code info:   
	> 	Version: 1.74.3 (system setup) (November 2022)  
	>		Commit: 97dec172d3256f8ca4bfb2143f3f76b503ca0534  
	>		Date: 2023-01-09T16:59:02.252Z  
	>		Electron: 19.1.8  
	>		Chromium: 102.0.5005.167  
	>		Node.js: 16.14.2  
	>		V8: 10.2.154.15-electron.0  
	>		OS: Windows_NT x64 10.0.19044  
	>		Sandboxed: No  

```csharp
dotnet new webapi -minimal -au IndividualB2C -o YOURPROJECTNAME

** Set Properties > launchSettings.json to use specific URL (optional)
"applicationUrl": "https://localhost:7042;http://localhost:5042",

// to debug PII errors (optional)
Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true; // debugging
// Optional CORS changes (not secure)
builder.Services.AddCors(options => options.AddPolicy("allowAny", o => o.AllowAnyOrigin()));

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // unsafe cors policy
    app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(origin => true) // allow any origin
        .AllowCredentials()); 
}

// note that, as of 1-2023, the string passed to Configuration[] defaults to AzureAd:Scopes when using 
// dotnet new webapi -minimal -au IndividualB2C -o YOURPROJECTNAME
// I opted to set it to AzureAdB2C:Scopes since the AzureAd section does not exist in appsettings.json.
var scopeRequiredByApi = app.Configuration["AzureAdB2C:Scopes"] ?? "";

// anonymous endpoint for API verification
app.MapGet("/anonlogin", () => "Anyone can call this. No Auth.")
   .AllowAnonymous();
```


# Azure Setup
- Register API App  **App ID: 2**
	- WebAPI-2 (name it whatever)
	- ClientID: 8b22ab15-f0fd-49d1-929c-d4b4f59cd697 (Use this value in appsettings.json)
	- Set Application ID URI
		- https://fscwi.onmicrosoft.com/webapi
	- Add Scope
		- api.read
		- https://fscwi.onmicrosoft.com/webapi/api.read
		- api.admin
		- https://fscwi.onmicrosoft.com/webapi/api.admin
		- access_as_user
		- https://fscwi.onmicrosoft.com/webapi/access_as_user  
- Register SPA  **App ID: 1**
	- SPA-2 (name it whatever)
	- ClientID: bc6fd8fb-0424-42d3-9bfc-08222165520d  ( Use this value in Postman )
	- https://happyDogTreats.onmicrosoft.com/webapi
	- RedirectURI
		- http://localhost:7042
		- ( remember to update WEBAPI launch settings.json )
		```json
		"applicationUrl": "https://localhost:7042;http://localhost:5042"
		```
	- Make sure Grant admin box is checked - [x]
	- ##### Enable implicit grant flow for Postman Testing
![image](https://user-images.githubusercontent.com/1066200/213930941-47604abc-d89f-46f3-86fc-3a54894d176b.png)

- Create a User Flow( **Sign in and sign up** )user flow (email only for now)
	- Email accounts
	- Add some claims
	- B2C_1_SUSHI
- #### Grant permissions
	- App registrations - select SPA (**APP ID: 1**)
		- API Permissions
		- + Add a permission
		- My APIs (Select WebApi-2)
			- Check boxes for permissions
		- Grant Admin Consent
		- Record scope full names
- Add additional Redirect URIs for testing SPA
	- https://oauth.pstmn.io/v1/callback
	- https://jwt.ms (Note that the JWT won't auto-populate UNLESS implicit grant flow is enabled)
	  
	  

# SPA Testing
- #### (Optional) Download SPA for testing
	- https://learn.microsoft.com/en-us/azure/active-directory-b2c/configure-authentication-sample-spa-app#step-31-update-the-spa-sample
	- git clone https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa.git
- npm install -g npm@9.3.1

# Postman Testing
	- This data is available @ Azure portal or via the azure cli
	- @ Azure portal, visit the App registrations page & click on Endpoints  
	  
![image](https://user-images.githubusercontent.com/1066200/213931449-0aa80ced-c8f3-4eaf-82aa-53fdcbd73775.png) 
1. Any name you want  
2. Works with SPA   
3. https://oauth.pstmn.io/v1/callback  
4. https://fscwi.b2clogin.com/fscwi.onmicrosoft.com/b2c_1_sushi/oauth2/v2.0/authorize  
	1. Get the template for the above endpoint from App registrations -> Endpoints ( Globe Icon )  
	2. https://fscwi.b2clogin.com/fscwi.onmicrosoft.com/YOUR-USER-FLOW-POLICY-NAME/oauth2/v2.0/authorize  
5. https://fscwi.b2clogin.com/fscwi.onmicrosoft.com/b2c_1_sushi/oauth2/v2.0/token   
	1. Same as #4, replace authorize with token  
6. Client ID from the SPA application (You will see an AADB2C90007 error if you enter the api id here)  
7. The endpoint you exposed from the API application, that the SPA application was granted access to  
	1. https://fscwi.onmicrosoft.com/webapi/api.read  
8. Default 
	
#### Troubleshooting
- WW-Authenticate: Bearer error="invalid_token", error_description="The audience '3f51546f-f135-41a4-9667-510709bf5f9f' is invalid"
	- try adding an additional line to your appsettings.json file
```json
"Audience":"3f51546f-f135-41a4-9667-510709bf5f9f",
```  

- InvalidOperationException / IOExceptions  

```
 System.InvalidOperationException: IDX20803: Unable to obtain configuration from: 'https://fscwi.b2clogin.com/fscwi.onmicrosoft.com/b2c_1_susi/v2.0/.well-known/openid-configuration'.
 ---> System.IO.IOException: IDX20807: Unable to retrieve document from: 'https://fscwi.b2clogin.com/fscwi.onmicrosoft.com/b2c_1_susi/v2.0/.well-known/openid-configuration'. HttpResponseMessage: 'StatusCode: 404, ReasonPhrase: 'Not Found', Version: 1.1, Content: System.Net.Http.HttpConnectionResponseContent, Headers:
```  
  - Verify that the correct B2C policy (User flow) is referenced in the appsettings.json file
  
  
- IDX20803: Unable to obtain configuration from: '[PII of type 'System.String' is hidden. For more details, see https://aka.ms/IdentityModel/PII.]'.
  - Add the following to Program.cs
  ```csharp
  Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true; // reveal PII in error log
	```  
	
- Warning: Unable to verify the first certificate
  - Haven't resolved this yet. Does not impact response when testing locally

- 401 after obtaining a valid JWT from B2C Authentication:
  - Make sure App Registration for SPA has the boxes checked for implicit grant and hybrid flows
