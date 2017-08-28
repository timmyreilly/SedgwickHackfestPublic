# SedgwickHackfest

## Subprojects
Look in the README.md file of each subproject to see how to setup your
development environment for that part of the system. Here's a brief table of
contents:

|Subproject | Description                                                      |
|-----------|------------------------------------------------------------------|
|Settlement | Truffle blockchain project.                                      |
|UI         | Web app UI for interacting with the blockchain.                  |



### Getting Started

Blockchain POC with Sedgwick

### Prerequisites

What things you need to install the software and how to install them

```
NodeJS
TruffleJS
```

### Installing

```
cd Settlement
truffle compile
truffle migrate
```

## Running the tests

```
cd Settlement
truffle test
```

## Connecting to Quorum:

Truffle:
140.87.66.68:22000
ssh admin@140.87.66.68
Password123!
`$ truffle deploy --network quorum `

## Deploying to Azure Web Apps:

There are two steps to this process, first we'll configure the web app on azure. Then we'll prepare our local code for deployment and push the project into the web app using git. 

First in azure. 
1. Go to [portal.azure.com](portal.azure.com) and create a new 'Web App` with the name and the resource group of your choosing. 
2. Wait for it to deploy and then select it from the Azure Dashboard. 
3. Now, under deployment options select local git repository. (Note: you can use the 'Deployment credentials' tab to reset your credentials. At the time of writing, username: `admin` & password: `Password123!`)
4. And before we do the deployment we're going to add some environment variables in the 'Application settings' tab. Select the 'Application settings' tab and scroll down to 'App settings'. Grab the keys and values from the `.env` in the `UI` directory. Here are my values at time of writing: 

        `WEB3_URL : http://140.87.66.68:22000`
        `SETTLEMENT_CONTRACT_ADDRESS : 0x123416ba165b94173741deeb649726466c6fa9b9`

5. Finally, we can copy the GIT URL from the 'Properites' tab. eg: 
        
        `https://sedgwick@sedgblockchain.scm.azurewebsites.net:443/SedgBlockchain.git`

Now on your computer + Git CMD. 
1. Start by cloning this whole project: `$ git clone https://github.com/timmyreilly/SedgwickHackfest.git` 
2. Copy the `UI` folder to a new directory. 
3. Initialize a new git repository:
`$ git init`
4. Add a .gitignore adjacent to app.js - [here's one you can copy](https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore) 
5. Add all files to staging and commit changes. `$ git add . ` & `$ git commit -am "initial commit for deployment"` 
6. Add the Azure Web APp instance git url to local remotes: 

        `$ git remote add azure https://sedgwick@sedgblockchain.scm.azurewebsites.net:443/SedgBlockchain.git` 

7. Now push to azure. (Note: I was only succefully able to enter my credentials using the Git CMD which you can download here.)

        `$ git push azure master`

8. Now, after deployment is finished visit yourSiteName.azurewebsites.net to view the web app. If you want to see what was deployed or learn more about the environment you've deployed to visit yourSiteName.scm.azurewebsites.net. 


## Built With

* [truffle](http://truffleframework.com/)

## Authors

* [user1m](https://github.com/user1m)
* [jcjimenez](https://github.com/jcjimenez)
* [timmyreilly](https://github.com/timmyreilly)
* [caleteeter](https://github.com/caleteeter)

## License

This project is licensed under the MIT License

## URL
https://github.com/timmyreilly/SedgwickHackfest

