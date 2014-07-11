let self = require('sdk/self');
let _ = require('underscore');
let { browserWindows } = require('sdk/windows');
let tabs = require('sdk/tabs');
let { setTimeout } = require('sdk/timers');
let { ActionButton } = require("sdk/ui");
let { notify } = require('sdk/notifications');

function scanForBugs(callback) {
  let count = 0, 
      bugs = _.filter(tabs, function(tab, i) {
    if (/^https\:\/\/bugzilla.mozilla.org\/show_bug.cgi\?id\=([\d]+)$/.test(tab.url)) {
      console.log("Bug!", tab.url, tab.title);
      count++;
      return true;
    }
  });
  callback(bugs);
}

exports.main = function(options) {
  _.each(_.range(10), function() {
    tabs.open('https://bugzilla.mozilla.org/show_bug.cgi?id=859138');
  });

  var action_button = ActionButton({
    id: "my-button",
    label: "Action Button!",
    icon: "./icon.png",
    onClick: function(state) {
      scanForBugs(function(bugs) {
        if (bugs.length <= 0) {
          text = "Zarro Boogs found";
        }
        else {
          text = "Found "+bugs.length+" bugs";
        }
        notify({
          title: "Bug Scan",
          text: text
        });
      });
    }
  });
};

exports.onUnload = function(reason) {
  console.log("unloading: ", reason);
};
