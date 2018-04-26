# Ansible Roles 
---------------

Ansible "roles" are reusable abstractions which can be created based on an overall function performed by a set of
tasks, and can be included into playbooks. Each role has a default structure with ```vars```, ```defaults``` ,```tasks```,
```meta``` and ```handler``` folders, with each containing a ```main.yml``` file. 

- The vars & defaults folders consist of variables used by the tasks in the role. 
- The meta folder contains role dependencies, i.e., tasks to be run before running current role tasks
- The handler takes care of service handling and is invoked by the ```notify``` keyword inside tasks

A brief outline of the functions associated with above components is described below :

- prerequisites : Installs python packages necessary for inventory generation

- inventory : Generates the hosts file based on entries in machines.in. The also role provides an option to
              setup passwordless SSH between the ansible host (localhost)  and the target hosts. In case the 
              same is setup, the hosts file will not contain hostvars for the ansible_ssh_password

- common : Installs apt packages common to Maya Server & Storage Node cluster

- master : Installs & configures maya server

- hosts : Installs & configures openebs storage hosts

- vagrant : Makes some config changes in maya server & node setup if machines are vagrant VMs

- volume : Creates a volume according to input parameters in all.yml

- localhost : Configures the client machine to run FIO container

- fio : Runs FIO profile in a test container after mounting block storage

- cleanup : Tear down iSCSI sessions & destroys volume on the storage nodes

- k8s-localhost: Prepares the test-harness for execution of kubernetes roles

- k8s-master: Installs and configures the kubernetes-master

- k8s-host: Installs and configures the kubernetes-minions. Also installs the openebs flexvol driver


