It's just another programming blog.  It's just the source code to my personal website, if you want to take at how I did it, or want to put up your own.  I like it and I'm more than happy to hear suggestions as to how to improve on either my development or my DevOps.

I'm using [AngularJS](angularjs.org) to serve an SPA, so I'm using [ExpressJS](expressjs.com) as the web server, since it's strict unopinionated nature makes it ideal for serving a single web page (you may notice the relative austerity of my index.jade, a relatively strong marker of the separation of concerns, imo), and a json api that Angular advocates.

On the DevOps side, I'm in the process of migrating from PostgreSQL/Heroku to DynamoDB/AWS, and doing more automating with Grunt.

The development version of the software is currently hosted at []d'http://justanotherprogrammingblog.herokuapp.com'>justanotherprogrammingblog.herokuapp.com</a>.

The Development environment requires:

[DynamoDB Local](https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_2013-12-12.tar.gz).  Development settings expect its location to be at the root of the project, in a folder called dynamodb_local

## License

Licensed under the MIT License.  A copy should be included with the project.

Copyright © 2014 Douglas Wade