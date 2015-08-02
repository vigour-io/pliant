var helpers = require('../../helpers')
var resolveGetter = helpers.resolveGetter
var cases =
    [ { str: "-c, --config <paths>", getter: "config" }
    , { str: "--build-dir <name>", getter: "buildDir" }
    , { str: "--history, --max-history <nb>", getter: "history" }
    , { str: "--sha-placeholder <string>", getter: "shaPlaceholder" }
    , { str: "-p, --port <port>", getter: "port" }
    , { str: "--retry-after <nbSeconds>", getter: "retryAfter" }
    , { str: "--min-free-space <proportion>", getter: "minFreeSpace" }
    , { str: "--asset-root <path>", getter: "assetRoot" }
    , { str: "--sha-dir <path>", getter: "shaDir" }
    , { str: "--sha-history-name <name>", getter: "shaHistoryName" }
    , { str: "--state-filename <name>", getter: "stateFilename" }
    , { str: "--no-robots", getter: "robots" }
    , { str: "--no-geo", getter: "geo" }
    , { str: "--akamai", getter: "akamai" }
    , { str: "--mail-from <email>", getter: "mailFrom" }
    , { str: "--mail-to <email>", getter: "mailTo" }
    , { str: "--mail-username <name>", getter: "mailUsername" }
    , { str: "--mail-password <password>", getter: "mailPassword" }
    , { str: "--slack-id <id>", getter: "slackId" }
    , { str: "--slack-token <token>", getter: "slackToken" }
    , { str: "--slack-channel <channel>", getter: "slackChannel" }
    , { str: "--git-owner <username>", getter: "gitOwner" }
    , { str: "--git-repo <name>", getter: "gitRepo" }
    , { str: "-b, --git-branch <name>", getter: "gitBranch" }
    , { str: "--git-username <name>", getter: "gitUsername" }
    , { str: "--git-password <password>", getter: "gitPassword" }
    , { str: "-g, --git-port <portNumber>", getter: "gitPort" }
    , { str: "--git-hub <user@domain>", getter: "gitHub" }
    , { str: "--git-api-host <apiDomain>", getter: "gitApiHost" }
    , { str: "--git-accept <acceptHeader>", getter: "gitAccept" }
    , { str: "--git-ua <userAgent>", getter: "gitUa" }
    , { str: "-x, --cleanup", getter: "cleanup" }
    , { str: "--src <path>", getter: "src" }
    , { str: "-r, --release", getter: "release" }
    , { str: "--release-suffix <string>", getter: "releaseSuffix" }
    , { str: "--release-name <name>", getter: "releaseName" }
    , { str: "--release-abs-path <path>", getter: "releaseAbsPath" }
    , { str: "-d, --deploy", getter: "deploy" }
    , { str: "--ip <ip>", getter: "ip" }
    , { str: "--identity <path>", getter: "identity" }
    , { str: "--ssh-id <id_rsa>", getter: "sshId" }
    , { str: "--ssh-key <id_rsa.pub>", getter: "sshKey" }
    , { str: "--ssl-cert <path>", getter: "sslCert" }
    , { str: "--ssl-key <path>", getter: "sslKey" }
    , { str: "--ssl-password <password>", getter: "sslPassword" }
    , { str: "--server-user <name>", getter: "serverUser" }
    , { str: "--remote-home <path>", getter: "remoteHome" }
    ]

describe("resolveGetter", function () {
	it("should should give the same answers as provided in the sample data", function () {
		cases.map(function (obj) {
			expect(resolveGetter(obj.str)).to.equal(obj.getter)
		})
	})
})