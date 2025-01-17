var xBrowserSync = xBrowserSync || {};
xBrowserSync.App = xBrowserSync.App || {};
var SpinnerDialog = {};
SpinnerDialog.hide = function () { };
SpinnerDialog.show = function () { };

/* ------------------------------------------------------------------------------------
 * Class name:  xBrowserSync.App.PlatformImplementation 
 * Description: Implements xBrowserSync.App.Platform for mobile apps.
 * ------------------------------------------------------------------------------------ */

xBrowserSync.App.PlatformImplementation = function ($interval, $q, $timeout, platform, globals, utility, bookmarks) {
  'use strict';

  var $scope, autoUpdatesInterval, currentUrl, loadingId, vm;

  var constants = {
    "title": {
      "message": "xBrowserSync"
    },
    "description": {
      "message": "Browser syncing as it should be: secure, anonymous and free! Sync bookmarks across your browsers and devices, no sign up required."
    },
    "tooltip_NotSynced_Label": {
      "message": "not synced"
    },
    "tooltip_Synced_Label": {
      "message": "synced"
    },
    "tooltip_Syncing_Label": {
      "message": "syncing"
    },
    "button_Help_Label": {
      "message": "Help guide"
    },
    "button_Next_Label": {
      "message": "Next"
    },
    "button_Previous_Label": {
      "message": "Previous"
    },
    "button_Skip_Label": {
      "message": "Skip"
    },
    "login_GetSyncId_Title": {
      "message": "Need a sync ID?"
    },
    "login_GetSyncId_Message": {
      "message": "<a href='https://link.xbrowsersync.org/download' class='new-tab'>Download</a> the xBrowserSync desktop browser extension available for Chrome and Firefox, create a new sync and then scan your sync ID QR code on the previous screen."
    },
    "help_Page_Welcome_Desktop_Content": {
      "message": "<h4>Welcome to xBrowserSync!</h4><p>xBrowserSync is a free and open-source alternative to browser sync services offered by Google, Mozilla, Opera and others, that respects your privacy and gives you complete anonymity (check out the <a href='https://link.xbrowsersync.org/www' class='new-tab'>website</a> for more info).</p><p>Take a moment to read through this help guide to familiarise yourself with xBrowserSync, using the paging links below or the arrow keys to move between pages.</p><p>Please note: xBrowserSync currently only syncs bookmarks. Syncing of additional browser data will be added in future versions, check out the development <a href='https://link.xbrowsersync.org/roadmap' class='new-tab'>roadmap</a> to see what’s planned.</p>"
    },
    "help_Page_Welcome_Android_Content": {
      "message": "<h4>Welcome to xBrowserSync!</h4><p>xBrowserSync is a free and open-source alternative to browser sync services offered by Google, Mozilla, Opera and others, that respects your privacy and gives you complete anonymity (check out the <a href='https://link.xbrowsersync.org/www' class='new-tab'>website</a> for more info)..</p><p>Take a moment to read through this help guide to familiarise yourself with xBrowserSync, using the paging links below or swiping to move between pages.</p>"
    },
    "help_Page_BeforeYouBegin_Chrome_Content": {
      "message": "<h4>Before you begin</h4><p>xBrowserSync modifies your local browser data so it’s a good idea to back up your bookmarks and other browser data just in case, and if you are using any other browser sync services or tools (such as <a href='https://link.xbrowsersync.org/chrome-sync' class='new-tab'>Google Chrome Sync</a>) please disable them to avoid conflicts.</p>"
    },
    "help_Page_BeforeYouBegin_Firefox_Content": {
      "message": "<h4>Before you begin</h4><p>xBrowserSync modifies your local browser data so it’s a good idea to back up your bookmarks and other browser data just in case, and if you are using any other browser sync services or tools (such as <a href='https://link.xbrowsersync.org/firefox-sync' class='new-tab'>Firefox Sync</a>) please disable them to avoid conflicts.</p>"
    },
    "help_Page_FirstSync_Desktop_Content": {
      "message": "<h4>Syncing for the first time</h4><p>xBrowserSync encrypts your browser data before it is transmitted over the internet to ensure that only you can read it. To start syncing, enter an encryption password. Be sure to make it strong but also memorable, there are no resets or reminders so if you forget it you won’t be able to access your synced data.</p><p>Once you click the Sync button your browser data will be encrypted and saved to the xBrowserSync service configured in the Settings panel.</p><p>Congratulations, you are now synced! Any changes you make to your local bookmarks will be synced automatically by xBrowserSync.</p>"
    },
    "help_Page_FirstSync_Android_Content": {
      "message": "<h4>Syncing for the first time</h4><p>First things first, head over to your desktop browser and <a href='https://link.xbrowsersync.org/download' class='new-tab'>download</a> the xBrowserSync extension (available for Chrome and Firefox).</p><p>When you create a new sync, your existing browser data will be encrypted locally and synced to the xBrowserSync service configured in the Settings panel.</p><p>Once you have synced your desktop browser data you can use your new sync ID to access your data here.</p>"
    },
    "help_Page_SyncId_Content": {
      "message": "<h4>Your sync ID</h4><p>When you create a new sync you are given a unique sync ID which you can use along with your password to sync your data on other devices. Your anonymity is ensured as no personal data is collected or stored with your synced data, and as it is encrypted it cannot be read by anyone but yourself.</p><p>This sync ID will only work with the xBrowserSync service on which it was created. Whenever you change services (via the Settings panel) you must create a new sync which will give you a new sync ID.</p><p>Once synced, you can view your sync ID in the Settings panel. Click it to reveal a handy QR code to scan when syncing on mobile devices.</p>"
    },
    "help_Page_ExistingId_Desktop_Content": {
      "message": "<h4>Syncing with your existing ID</h4><p>Click on “Already got a sync ID?” to enter your existing sync ID and password. If you are synced to a different xBrowserSync service make sure it is configured in the Settings panel.</p><p>xBrowserSync will retrieve and decrypt your encrypted data using your locally stored password, then clear your local bookmarks before re-populating them from the decrypted data.</p><p>Whilst synced, any changes to your synced data will be detected in the background and your local bookmarks will be updated automatically. You can also force updates manually in the Settings panel.</p>"
    },
    "help_Page_ExistingId_Android_Content": {
      "message": "<h4>Syncing with your existing ID</h4><p>Click on “Already got a sync ID?” to enter your existing sync ID and password.</p><p>Rather than attempt to type the long sync ID, simply press the QR icon in the ID field and then scan the QR code for your sync ID (you can find it in the Settings panel of the desktop browser extension, click on your sync ID to reveal it).</p><p>If you are synced to a different xBrowserSync service make sure it is configured in the Settings panel.</p><p>xBrowserSync will retrieve and decrypt your encrypted data using your locally stored password, then display your bookmarks for searching.</p>"
    },
    "help_Page_Service_Content": {
      "message": "<h4>Syncing to another service</h4><p>By default your data is synced to the <a href='https://link.xbrowsersync.org/api' class='new-tab'>official xBrowserSync service</a>, though anyone can <a href='https://link.xbrowsersync.org/api-repo' class='new-tab'>run their own xBrowserSync service</a>, either for private use (for ultimate security and privacy) or to make available for public use so that more people can enjoy xBrowserSync.</p><p>Check the list of public <a href='https://link.xbrowsersync.org/service-list' class='new-tab'>xBrowserSync services</a> and configure which service to sync to in the Settings panel.</p>"
    },
    "help_Page_Searching_Desktop_Content": {
      "message": "<h4>Searching your bookmarks</h4><p>Once synced, simply press Enter to display your recent bookmarks or type some keywords or a URL to search your bookmarks.</p><p>To edit or delete a bookmark, hover over the bookmark and click the now visible edit icon next to the bookmark’s title.</p>"
    },
    "help_Page_Searching_Android_Content": {
      "message": "<h4>Searching your bookmarks</h4><p>Once synced, your bookmarks are displayed in chronological order when you open xBrowserSync. Type some keywords or a URL in the search box to search your bookmarks.</p><p>Long pressing on a bookmark will allow you to directly share, modify or delete the bookmark.</p>"
    },
    "help_Page_AddingBookmarks_Chrome_Content": {
      "message": "<h4>Adding a bookmark</h4><p>Bookmark the current page by clicking on the bookmark icon in the Search panel. The bookmark’s properties will be populated for you automatically, otherwise add a description and some tags to ensure better search results.</p><p>Alternatively, simply click the browser’s “Bookmark this page” button as normal and xBrowserSync will automatically populate the bookmark’s properties (optional permissions must be granted for this to work, check the Settings panel).</p>"
    },
    "help_Page_AddingBookmarks_Firefox_Content": {
      "message": "<h4>Adding a bookmark</h4><p>Bookmark the current page by clicking on the bookmark icon in the Search panel. The bookmark’s properties will be populated for you automatically, otherwise add a description and some tags to ensure better search results.</p><p>Alternatively, simply click the browser’s “Bookmark this page” button as normal and xBrowserSync will automatically populate the bookmark’s properties.</p>"
    },
    "help_Page_AddingBookmarks_Android_Content": {
      "message": "<h4>Adding a bookmark</h4><p>Add bookmarks easily by sharing to xBrowserSync from any apps that share URLs such as browsers, YouTube, Spotify and many more.</p><p>The bookmark’s properties will be fetched for you, otherwise add a description and some tags to ensure better search results.</p>"
    },
    "help_Page_NativeFeatures_Chrome_Content": {
      "message": "<h4>Native features supported</h4><p>Feel free to continue using your browser’s native bookmarking features such as the bookmarks bar and bookmarks manager, any changes you make will be synced automatically in the background.</p><p>If you have organised your existing bookmarks into folders don’t worry, xBrowserSync will respect and maintain your existing bookmarks hierarchy.</p>"
    },
    "help_Page_NativeFeatures_Firefox_Content": {
      "message": "<h4>Native features supported</h4><p>Feel free to continue using your browser’s native bookmarking features such as the bookmarks toolbar and bookmarks library, any changes you make will be synced automatically in the background.</p><p>If you have organised your existing bookmarks into folders don’t worry, xBrowserSync will respect and maintain your existing bookmarks hierarchy.</p><p>Please note however, as Firefox’s bookmarks API does not yet support accessing native bookmark tags, any existing tags will be lost when syncing and tags added via xBrowserSync will not be saved as native tags.</p>"
    },
    "help_Page_BackingUp_Content": {
      "message": "<h4>Remember to back up</h4><p>When you use xBrowserSync your data is your reponsibility so be smart and make sure to take backups.</p><p>You can do this easily in the Settings panel, you can back up your unencrypted data to a local file which can be used to restore your data should you need to.</p>"
    },
    "help_Page_Shortcuts_Chrome_Content": {
      "message": "<h4>Use shortcuts!</h4><p>To search your bookmarks quickly, use the default keyboard shortcut (Ctrl+Space) to activate the extension, then simply press Enter to view your recent bookmarks or start typing to search.</p><p>To change the shortcut, browse to chrome://extensions/shortcuts and update the available shortcuts under xBrowserSync."
    },
    "help_Page_Shortcuts_Firefox_Content": {
      "message": "<h4>Use shortcuts!</h4><p>To search your bookmarks quickly, use the default keyboard shortcut (Ctrl+Space) to activate the extension, then simply press Enter to view your recent bookmarks or start typing to search.</p><p>To change the shortcut, browse to about:addons, click on “Manage Extension Shortcuts” in the Settings menu and update the available shortcuts under xBrowserSync."
    },
    "help_Page_Mobile_Content": {
      "message": "<h4>Go mobile</h4><p>Access your synced bookmarks on the move with the xBrowserSync Android app, available on <a href='https://link.xbrowsersync.org/download-android' class='new-tab'>Google Play</a> store, <a href='https://link.xbrowsersync.org/fdroid' class='new-tab'>F-Droid</a> or <a href='https://link.xbrowsersync.org/app-releases-latest' class='new-tab'>direct download</a>.</p>"
    },
    "help_Page_Desktop_Content": {
      "message": "<h4>Got desktop?</h4><p>Sync your bookmarks across desktop and mobile devices by using the xBrowserSync desktop browser web extension alongside the mobile app.</p><p>Currently available for Chrome and Firefox, Opera support coming very soon.</p>"
    },
    "help_Page_FurtherSupport_Content": {
      "message": "<h4>Further support</h4><p>You can find the answers to most common questions in the <a href='https://link.xbrowsersync.org/faqs' class='new-tab'>FAQs</a>, also check the current <a href='https://link.xbrowsersync.org/known-issues' class='new-tab'>known issues</a> to see if your issue is listed there.</p><p>Alternatively, use the <a href='https://link.xbrowsersync.org/app-issues' class='new-tab'>issue tracker</a> to report an issue or request a new feature.</p>"
    },
    "button_Settings_Label": {
      "message": "Settings"
    },
    "button_AddBookmark_Label": {
      "message": "Add Bookmark"
    },
    "button_DeleteBookmark_Label": {
      "message": "Delete Bookmark"
    },
    "button_EditBookmark_Label": {
      "message": "Edit Bookmark"
    },
    "button_ShareBookmark_Label": {
      "message": "Share Bookmark"
    },
    "login_PasswordConfirmationField_Label": {
      "message": "Confirm password"
    },
    "login_PasswordField_Label": {
      "message": "Encryption password"
    },
    "login_PasswordField_New_Description": {
      "message": "Enter an encryption password"
    },
    "login_PasswordField_Existing_Description": {
      "message": "Your encryption password"
    },
    "login_IdField_Label": {
      "message": "ID"
    },
    "login_IdField_Description": {
      "message": "Your sync ID"
    },
    "button_ScanCode_Label": {
      "message": "Scan your sync ID"
    },
    "button_DisableSync_Label": {
      "message": "Disable sync"
    },
    "button_EnableSync_Label": {
      "message": "Sync"
    },
    "button_ExistingSync_Label": {
      "message": "Back"
    },
    "button_NewSync_Label": {
      "message": "Don’t have a sync ID?"
    },
    "login_ConfirmSync_Title": {
      "message": "Create new sync?"
    },
    "login_ConfirmSync_Message": {
      "message": "No sync ID has been provided so a new sync will be created for you. OK to proceed?"
    },
    "login_DisableOtherSyncs_Title": {
      "message": "Disable bookmark sync tools"
    },
    "login_DisableOtherSyncs_Message": {
      "message": "Syncing your browser data with xBrowserSync whilst other bookmark sync tools (such as <a href='https://link.xbrowsersync.org/chrome-sync' class='new-tab'>Google Chrome Sync</a>) are active can cause duplication and possibly corrupted data. Please disable them before continuing."
    },
    "login_UpgradeSync_Title": {
      "message": "Ready to upgrade sync?"
    },
    "login_UpgradeSync_Message": {
      "message": "<p>This sync ID must be upgraded in order to sync with this version of xBrowserSync. After upgrading, you will not be able to sync with previous versions of xBrowserSync.</p><p>Ensure you have updated all of your xBrowserSync apps before continuing. Ready to proceed?</p>"
    },
    "updated_Message": {
      "message": "xBrowserSync has been updated with the latest features and fixes. For more details about the changes contained in this release, check out the release notes."
    },
    "updated_Title": {
      "message": "Updated to v"
    },
    "support_Message": {
      "message": "<p>We want to make xBrowserSync the number one browser sync tool, but there’s still a lot to do:</p><ul><li>Add syncing of browser tabs and history</li><li>Support all major desktop browsers</li><li>Translate into other languages</li><li>And <a href='https://link.xbrowsersync.org/roadmap' class='new-tab'>much more</a>!</li></ul><p>Only with your support can we continue to improve xBrowserSync and ensure that it remains an effective tool in protecting our privacy and productivity against the rot of big tech!</p>"
    },
    "support_Title": {
      "message": "Support xBrowserSync!"
    },
    "permissions_Message": {
      "message": "<p>xBrowserSync automatically enriches bookmarks added using the browser’s Add Bookmark button with available metadata. To enable this, xBrowserSync <a href='https://link.xbrowsersync.org/optional-perms-faq' class='new-tab'>requires additional permissions</a> to be able to read visited website data.</p><p>Please indicate if prompted if you are happy to grant these permissions, alternatively you can add or remove permissions at any time in the Settings panel.</p>"
    },
    "permissions_Title": {
      "message": "Optional permissions"
    },
    "button_Confirm_Label": {
      "message": "Yes"
    },
    "button_Deny_Label": {
      "message": "No"
    },
    "search_Field_Description": {
      "message": "Find a bookmark"
    },
    "search_NoBookmarks_Message": {
      "message": "You currently have no bookmarks.<br/><br/>Start bookmarking web pages, videos, music and more from your favourite apps by sharing them to xBrowserSync."
    },
    "search_NoResults_Message": {
      "message": "No bookmarks found"
    },
    "shareBookmark_Message": {
      "message": "Share bookmark with"
    },
    "bookmarkShared_Message": {
      "message": "shared from xBrowserSync"
    },
    "settings_Sync_SyncToolbarConfirmation_Message": {
      "message": "<p>Enabling this setting will replace the bookmarks currently in the bookmarks toolbar with your synced bookmarks.</p><p>OK to proceed?</p>"
    },
    "settings_Sync_ConfirmCancelSync_Message": {
      "message": "<p>There is currently a sync in progress, if you proceed your local synced data will be incomplete.</p><p>OK to proceed?</p>"
    },
    "settings_Sync_Id_Description": {
      "message": "Use your sync ID to access your synced data on other devices."
    },
    "settings_Sync_SyncToolbar_Label": {
      "message": "Sync bookmarks toolbar"
    },
    "settings_Sync_SyncToolbar_Description": {
      "message": "Disable this setting to display different toolbar bookmarks across synced browers."
    },
    "settings_Service_ChangeService_Label": {
      "message": "Change service"
    },
    "settings_Service_ChangeService_Description": {
      "message": "Switch to a different xBrowserSync service."
    },
    "settings_BackupRestore_Backup_Label": {
      "message": "Back up"
    },
    "settings_BackupRestore_BackupLocal_Description": {
      "message": "Back up local browser data to a file."
    },
    "settings_BackupRestore_BackupSynced_Description": {
      "message": "Back up synced data to a file."
    },
    "settings_BackupRestore_Restore_Label": {
      "message": "Restore"
    },
    "settings_BackupRestore_RestoreLocal_Description": {
      "message": "Restore local browser data from a backup."
    },
    "settings_BackupRestore_RestoreSynced_Description": {
      "message": "Restore synced data from a backup."
    },
    "settings_About_Title": {
      "message": "About"
    },
    "settings_About_AppVersion_Label": {
      "message": "Version"
    },
    "button_ReleaseNotes_Label": {
      "message": "View release notes"
    },
    "button_Support_Label": {
      "message": "Support xBrowserSync"
    },
    "settings_Issues_Help_Label": {
      "message": "Help"
    },
    "settings_Issues_Help_Description": {
      "message": "Got a question or having an issue? Make sure to read through the help guide, otherwise the answer may be in the FAQs."
    },
    "settings_Issues_ViewFAQs_Label": {
      "message": "View FAQs"
    },
    "button_Cryptos_Label": {
      "message": "Cryptos"
    },
    "button_Liberapay_Label": {
      "message": "Liberapay"
    },
    "button_Patreon_Label": {
      "message": "Patreon"
    },
    "settings_Issues_Title": {
      "message": "Issues"
    },
    "settings_Issues_Tracker_Label": {
      "message": "Issues tracker"
    },
    "settings_Issues_Tracker_Description": {
      "message": "Report an issue to report a bug or request a new feature."
    },
    "settings_Issues_RaiseIssue_Label": {
      "message": "Report issue"
    },
    "settings_Issues_Log_Label": {
      "message": "Application log"
    },
    "settings_Issues_Log_Description": {
      "message": "Download and include the application log when you log an issue."
    },
    "settings_Issues_ClearLog_Label": {
      "message": "Clear log"
    },
    "settings_Issues_DownloadLog_Label": {
      "message": "Download log"
    },
    "settings_Issues_LogDownloaded_Message": {
      "message": "If the log file does not download automatically, right click on the link below and “Save link as...”."
    },
    "settings_Issues_LogSize_Label": {
      "message": "Current log size"
    },
    "settings_Permissions_Title": {
      "message": "Optional permissions"
    },
    "settings_Permissions_ReadWebsiteData_Title": {
      "message": "Read website data"
    },
    "settings_Permissions_ReadWebsiteData_Description": {
      "message": "Required to automatically add metadata to bookmarks when using the browser’s “Bookmark this page” button (<a href='https://link.xbrowsersync.org/optional-perms-faq' class='new-tab'>more info</a>)."
    },
    "settings_Permissions_ReadWebsiteData_Granted_Label": {
      "message": "Granted"
    },
    "settings_Permissions_ReadWebsiteData_NotGranted_Label": {
      "message": "Not granted"
    },
    "button_Permissions_Remove_Label": {
      "message": "Remove permissions"
    },
    "button_Permissions_Add_Label": {
      "message": "Grant permissions"
    },
    "settings_Service_Title": {
      "message": "Service"
    },
    "settings_Service_Status_NoNewSyncs": {
      "message": "Not accepting new syncs"
    },
    "settings_Service_Status_Error": {
      "message": "Connection error"
    },
    "settings_Service_Status_Loading": {
      "message": "Checking..."
    },
    "settings_Service_Status_Online": {
      "message": "Online"
    },
    "settings_Service_Status_Offline": {
      "message": "Offline"
    },
    "button_UpdateServiceUrl_Label": {
      "message": "Change Service"
    },
    "settings_Service_UpdateForm_Message": {
      "message": "Enter the URL of an alternative xBrowserSync service. Browse the list of public xBrowserSync services <a href='https://link.xbrowsersync.org/service-list' class='new-tab'>here</a>."
    },
    "settings_Service_UpdateForm_Field_Description": {
      "message": "xBrowserSync service URL"
    },
    "button_Update_Label": {
      "message": "Update"
    },
    "button_Cancel_Label": {
      "message": "Cancel"
    },
    "settings_Service_UpdateForm_Confirm_Message": {
      "message": "<p>After changing the service, the current sync will be disabled and you’ll need to create a new sync.</p><p>If you have previously created a sync using this service and would like to retrieve your data, you can use the sync ID provided at the time.</p><p>OK to proceed?</p>"
    },
    "settings_Service_UpdateForm_Required_Label": {
      "message": "xBrowserSync service URL is required"
    },
    "settings_Service_UpdateForm_InvalidService_Label": {
      "message": "Not a valid xBrowserSync service"
    },
    "settings_Service_UpdateForm_RequestFailed_Label": {
      "message": "Unable to connect to the service"
    },
    "settings_Service_UpdateForm_ServiceVersionNotSupported_Label": {
      "message": "This service is running an unsupported API version"
    },
    "settings_BackupRestore_Title": {
      "message": "Back up and restore"
    },
    "settings_BackupRestore_NotAvailable_Message": {
      "message": "Back up and restore will be available here once you are synced."
    },
    "button_Backup_Label": {
      "message": "Back up"
    },
    "button_Restore_Label": {
      "message": "Restore"
    },
    "button_Saving_Label": {
      "message": "Saving..."
    },
    "button_Done_Label": {
      "message": "Done"
    },
    "button_Clear_Label": {
      "message": "Clear"
    },
    "button_Close_Label": {
      "message": "Close"
    },
    "button_Continue_Label": {
      "message": "Continue"
    },
    "button_Back_Label": {
      "message": "Back"
    },
    "settings_BackupRestore_BackupSuccess_Message": {
      "message": "Backup file {fileName} saved to internal storage."
    },
    "settings_BackupRestore_RestoreSuccess_Message": {
      "message": "Your data has been restored."
    },
    "settings_BackupRestore_RestoreForm_Message": {
      "message": "Select an xBrowserSync backup file to restore."
    },
    "settings_BackupRestore_RestoreForm_DataField_Label": {
      "message": "Paste backup data"
    },
    "settings_BackupRestore_RestoreForm_Invalid_Label": {
      "message": "Invalid xBrowserSync backup data"
    },
    "button_SelectBackupFile_Label": {
      "message": "Select file"
    },
    "button_RestoreData_Label": {
      "message": "Restore data"
    },
    "button_RestoreData_Invalid_Label": {
      "message": "Invalid data"
    },
    "button_RestoreData_Ready_Label": {
      "message": "Ready to restore"
    },
    "settings_Sync_Title": {
      "message": "Sync"
    },
    "settings_Sync_NotAvailable_Message": {
      "message": "Sync settings will be available here once you are synced."
    },
    "settings_Sync_Id_Label": {
      "message": "Sync ID"
    },
    "settings_Sync_DisplayQRCode_Message": {
      "message": "Display QR code"
    },
    "settings_Service_DataUsage_Label": {
      "message": "Data usage"
    },
    "settings_Service_DataUsage_Description": {
      "message": "How much of the data limit for this service is your current sync using."
    },
    "settings_BackupRestore_ConfirmRestore_Sync_Message": {
      "message": "<p>The data being restored will overwrite your synced data.</p><p>OK to proceed?</p>"
    },
    "settings_BackupRestore_ConfirmRestore_NoSync_Message": {
      "message": "<p>As sync is currently disabled, the data being restored will overwrite the local browser data.</p><p>OK to proceed?</p>"
    },
    "bookmark_Title_Add": {
      "message": "Add bookmark"
    },
    "bookmark_Title_Edit": {
      "message": "Edit bookmark"
    },
    "bookmark_TitleField_Label": {
      "message": "Title"
    },
    "bookmark_UrlField_Label": {
      "message": "URL"
    },
    "bookmark_DescriptionField_Label": {
      "message": "Description"
    },
    "bookmark_TagsField_Label": {
      "message": "Tags"
    },
    "bookmark_TagsField_Description": {
      "message": "tag 1, tag 2, tag 3, etc..."
    },
    "bookmark_BookmarkForm_Required_Label": {
      "message": "Bookmark URL is required"
    },
    "bookmark_BookmarkForm_Exists_Label": {
      "message": "URL has already been bookmarked"
    },
    "button_AddTags_Label": {
      "message": "Add"
    },
    "button_DeleteTag_Label": {
      "message": "Remove tag"
    },
    "button_Delete_Label": {
      "message": "Delete"
    },
    "button_Share_Label": {
      "message": "Share"
    },
    "button_ClearTags_Label": {
      "message": "Clear tags"
    },
    "qr_Copied_Label": {
      "message": "Copied!"
    },
    "qr_CopySyncId_Label": {
      "message": "Copy sync ID to clipboard"
    },
    "qr_Message": {
      "message": "Scan this QR code using the xBrowserSync Android app to access your synced data on your mobile device."
    },
    "working_Title": {
      "message": "Syncing..."
    },
    "connRestored_Title": {
      "message": "Connection restored"
    },
    "connRestored_Message": {
      "message": "Your xBrowserSync changes have been synced."
    },
    "bookmark_Metadata_Message": {
      "message": "Fetching bookmark properties, touch to cancel."
    },
    "error_Default_Title": {
      "message": "Something went wrong"
    },
    "error_Default_Message": {
      "message": "Sorry about that, if the problem persists you can <a href='https://link.xbrowsersync.org/app-issues' class='new-tab'>report an issue</a>."
    },
    "error_HttpRequestFailed_Title": {
      "message": "Connection lost"
    },
    "error_HttpRequestFailed_Message": {
      "message": "Couldn’t connect to the xBrowserSync service, check the service status in the Settings panel."
    },
    "error_HttpRequestFailedWhileUpdating_Title": {
      "message": "Connection lost"
    },
    "error_HttpRequestFailedWhileUpdating_Message": {
      "message": "Sync will be retried automatically when connection is restored."
    },
    "error_TooManyRequests_Title": {
      "message": "Service request limit hit"
    },
    "error_TooManyRequests_Message": {
      "message": "Sync has been disabled, re-enable sync to resume syncing."
    },
    "error_RequestEntityTooLarge_Title": {
      "message": "Sync data limit exceeded"
    },
    "error_RequestEntityTooLarge_Message": {
      "message": "Unable to sync your data as it exceeds the size limit set by the xBrowserSync service. Remove some old bookmarks and try again or switch to a different xBrowserSync service that allows for larger syncs."
    },
    "error_NotAcceptingNewSyncs_Title": {
      "message": "Service not accepting new syncs"
    },
    "error_NotAcceptingNewSyncs_Message": {
      "message": "Unable to create a new sync as the service is not currently accepting new syncs. If you have already created a sync using this service enter your sync ID, or use a different service."
    },
    "error_DailyNewSyncLimitReached_Title": {
      "message": "Daily new sync limit reached"
    },
    "error_DailyNewSyncLimitReached_Message": {
      "message": "Unable to create new sync as you have reached your daily new sync limit for this xBrowserSync service. Sync with an existing sync ID, choose a different service or try again tomorrow."
    },
    "error_MissingClientData_Title": {
      "message": "Missing credentials"
    },
    "error_MissingClientData_Message": {
      "message": "Unable to find stored credentials. Re-enable sync and try again."
    },
    "error_InvalidCredentials_Title": {
      "message": "Invalid credentials"
    },
    "error_InvalidCredentials_Message": {
      "message": "Check your sync ID and password, also make sure the current service is the same as where the sync was created."
    },
    "error_SyncRemoved_Title": {
      "message": "Sync not found"
    },
    "error_SyncRemoved_Message": {
      "message": "The requested sync does not exist on the service, it may have been removed due to inactivity. Create a new sync and restore your data from a backup."
    },
    "error_NoDataToRestore_Title": {
      "message": "No data to restore"
    },
    "error_NoDataToRestore_Message": {
      "message": "Ensure you have provided a valid xBrowserSync back up before restoring."
    },
    "error_LocalSyncError_Title": {
      "message": "Sync error"
    },
    "error_LocalSyncError_Message": {
      "message": "An error occurred whilst syncing local changes. Your local bookmarks have now been refreshed so you may need to redo the previous change."
    },
    "error_OutOfSync_Title": {
      "message": "Data out of sync"
    },
    "error_OutOfSync_Message": {
      "message": "Local data was out of sync but has now been refreshed. Your local bookmarks have now been refreshed so you may need to redo the previous change."
    },
    "error_ApiInvalid_Title": {
      "message": "Invalid xBrowserSync service"
    },
    "error_ApiInvalid_Message": {
      "message": "The selected service URL is not pointing to a valid xBrowserSync service."
    },
    "error_ApiOffline_Title": {
      "message": "Service offline"
    },
    "error_ApiOffline_Message": {
      "message": "The service is currently offline. Check the service status in the Settings panel for more information or try again later."
    },
    "error_ApiVersionNotSupported_Title": {
      "message": "Service not supported"
    },
    "error_ApiVersionNotSupported_Message": {
      "message": "This service is running an unsupported API version."
    },
    "error_ContainerChanged_Title": {
      "message": "xBrowserSync folder changed"
    },
    "error_ContainerChanged_Message": {
      "message": "Modifying xBrowserSync [xbs] folders can cause sync issues. The previous change was not synced and your local bookmarks have been refreshed."
    },
    "error_LocalContainerNotFound_Title": {
      "message": "Unexpected bookmarks structure"
    },
    "error_LocalContainerNotFound_Message": {
      "message": "This could be caused by a corrupt browser profile. Try syncing with a fresh profile before importing any existing bookmarks."
    },
    "error_FailedGetPageMetadata_Title": {
      "message": "Couldn’t get URL metadata"
    },
    "error_FailedGetPageMetadata_Message": {
      "message": "Try sharing the URL again or enter metadata manually."
    },
    "error_SyncInterrupted_Title": {
      "message": "Sync interrupted"
    },
    "error_SyncInterrupted_Message": {
      "message": "A previous sync was interrupted and failed to complete. Re-enable sync to restore your synced data."
    },
    "error_ScanFailed_Title": {
      "message": "Scan failed"
    },
    "error_ShareFailed_Title": {
      "message": "Share failed"
    },
    "error_FailedBackupData_Title": {
      "message": "Backup failed"
    },
    "error_FailedGetDataToRestore_Title": {
      "message": "Browse files failed"
    },
    "error_FailedRestoreData_Title": {
      "message": "Unable to read the selected file"
    },
    "error_FailedRestoreData_Message": {
      "message": ""
    },
    "error_FailedShareUrl_Title": {
      "message": "Unable to retrieve shared bookmark URL"
    },
    "error_FailedShareUrlNotSynced_Title": {
      "message": "You must be synced to add a bookmark"
    }
  };


	/* ------------------------------------------------------------------------------------
	 * Constructor
	 * ------------------------------------------------------------------------------------ */

  var AndroidImplementation = function () {
    // Inject required platform implementation functions
    platform.AutomaticUpdates.Start = startAutoUpdates;
    platform.AutomaticUpdates.Stop = stopAutoUpdates;
    platform.BackupData = backupData;
    platform.Bookmarks.Clear = clearBookmarks;
    platform.Bookmarks.CreateSingle = createSingle;
    platform.Bookmarks.DeleteSingle = deleteSingle;
    platform.Bookmarks.Get = getBookmarks;
    platform.Bookmarks.Populate = populateBookmarks;
    platform.Bookmarks.Share = shareBookmark;
    platform.Bookmarks.UpdateSingle = updateSingle;
    platform.GetConstant = getConstant;
    platform.GetCurrentUrl = getCurrentUrl;
    platform.GetHelpPages = getHelpPages;
    platform.GetPageMetadata = getPageMetadata;
    platform.Init = init;
    platform.Interface.Loading.Show = displayLoading;
    platform.Interface.Loading.Hide = hideLoading;
    platform.Interface.Refresh = refreshInterface;
    platform.LocalStorage.Get = getFromLocalStorage;
    platform.LocalStorage.Set = setInLocalStorage;
    platform.OpenUrl = openUrl;
    platform.ScanID = scanId;
    platform.SelectFile = selectBackupFile;
    platform.Sync.Execute = sync;
  };


	/* ------------------------------------------------------------------------------------
	 * Public functions
	 * ------------------------------------------------------------------------------------ */

  var backupData = function () {
    var deferred = $q.defer();

    // Export bookmarks
    bookmarks.Export()
      .then(function (data) {
        var fileName = utility.GetBackupFileName();
        var saveBackupFileError = function () {
          return deferred.reject({ code: globals.ErrorCodes.FailedBackupData });
        };

        // Set backup file storage location to external storage
        var storageLocation = cordova.file.externalRootDirectory;

        // Save backup file to storage location
        window.resolveLocalFileSystemURL(storageLocation, function (dirEntry) {
          dirEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
              // Save export file
              fileWriter.write(JSON.stringify(data));

              var success = function () {
                var message = constants.settings_BackupRestore_BackupSuccess_Message.message.replace(
                  '{fileName}',
                  fileEntry.name);

                $scope.$apply(function () {
                  vm.settings.backupCompletedMessage = message;
                });

                deferred.resolve();
              };

              fileWriter.onwriteend = function () {
                success();
              };

              fileWriter.onerror = saveBackupFileError;
            },
              saveBackupFileError);
          },
            saveBackupFileError);
        },
          saveBackupFileError);
      });

    return deferred.promise;
  };

  var clearBookmarks = function () {
    return $q.resolve();
  };

  var createSingle = function () {
    return $q.resolve();
  };

  var deleteSingle = function () {
    return $q.resolve();
  };

  var displayLoading = function (id, deferred) {
    var timeout;

    // Return if loading overlay already displayed
    if (loadingId) {
      return;
    }

    switch (id) {
      // Checking updated service url, wait a moment before displaying loading overlay
      case 'checkingNewServiceUrl':
        timeout = $timeout(function () {
          SpinnerDialog.show(null, getConstant(globals.Constants.Working_Title), false, { overlayOpacity: 0.75 });
        }, 100);
        break;
      // Loading bookmark metadata, display cancellable overlay
      case 'retrievingMetadata':
        var cancel = function () {
          deferred.resolve({ url: currentUrl });
        };
        timeout = $timeout(function () {
          SpinnerDialog.show(null, getConstant(globals.Constants.Bookmark_Metadata_Message), cancel, { overlayOpacity: 0.75 });
        }, 250);
        break;
      // Display default overlay
      default:
        timeout = $timeout(function () {
          SpinnerDialog.show(null, getConstant(globals.Constants.Working_Title), false, { overlayOpacity: 0.75 });
        });
        break;
    }

    loadingId = id;
    return timeout;
  };

  var getBookmarks = function () {
    return $q.resolve();
  };

  var getConstant = function (constName) {
    return constants[constName].message;
  };

  var getCurrentUrl = function () {
    return $q.resolve(currentUrl);
  };

  var getHelpPages = function () {
    var pages = [
      platform.GetConstant(globals.Constants.Help_Page_Welcome_Android_Content),
      platform.GetConstant(globals.Constants.Help_Page_FirstSync_Android_Content),
      platform.GetConstant(globals.Constants.Help_Page_SyncId_Content),
      platform.GetConstant(globals.Constants.Help_Page_ExistingId_Android_Content),
      platform.GetConstant(globals.Constants.Help_Page_Service_Content),
      platform.GetConstant(globals.Constants.Help_Page_Searching_Android_Content),
      platform.GetConstant(globals.Constants.Help_Page_AddingBookmarks_Android_Content),
      platform.GetConstant(globals.Constants.Help_Page_BackingUp_Content),
      platform.GetConstant(globals.Constants.Help_Page_Desktop_Content),
      platform.GetConstant(globals.Constants.Help_Page_FurtherSupport_Content)
    ];

    return pages;
  };

  var getFromLocalStorage = function (itemName) {
    return localStorage.getItem(itemName);
  };

  var getPageMetadata = function (deferred) {
    var inAppBrowser, inAppBrowserTimeout;

    // If current url not set, return with default url
    if (!currentUrl) {
      return $q.resolve({ url: 'http://' });
    }

    // If current url is not valid, return with default url
    var matches = currentUrl.match(/^https?:\/\/\w+/i);
    if (!matches || matches.length <= 0) {
      return $q.resolve({ url: 'http://' });
    }

    var handleResponse = function (pageContent, err) {
      var parser, html;

      // Cancel timeout
      if (inAppBrowserTimeout) {
        $timeout.cancel(inAppBrowserTimeout);
        inAppBrowserTimeout = null;
      }

      // Check html content was returned
      if (err || !pageContent) {
        if (err) {
          utility.LogError(err, 'platform.handleResponse');
        }

        var errObj = { code: globals.ErrorCodes.FailedGetPageMetadata, url: currentUrl };

        // Reset current url
        currentUrl = null;

        // Return error
        deferred.reject(errObj);

        // Close InAppBrowser
        inAppBrowser.close();
        inAppBrowser = null;

        return;
      }

      // Extract metadata properties
      parser = new DOMParser();
      html = parser.parseFromString(pageContent, 'text/html');

      // Get all meta tags
      var metaTagsArr = html.getElementsByTagName('meta');

      var getPageDescription = function () {
        for (var i = 0; i < metaTagsArr.length; i++) {
          var currentTag = metaTagsArr[i];
          if ((!!currentTag.getAttribute('property') && currentTag.getAttribute('property').toUpperCase().trim() === 'OG:DESCRIPTION' && !!currentTag.getAttribute('content')) ||
            (!!currentTag.getAttribute('name') && currentTag.getAttribute('name').toUpperCase().trim() === 'TWITTER:DESCRIPTION' && !!currentTag.getAttribute('content')) ||
            (!!currentTag.getAttribute('name') && currentTag.getAttribute('name').toUpperCase().trim() === 'DESCRIPTION' && !!currentTag.getAttribute('content'))) {
            return (!!currentTag.getAttribute('content')) ? currentTag.getAttribute('content').trim() : '';
          }
        }

        return null;
      };

      var getPageKeywords = function () {
        // Get open graph tag values 
        var currentTag, i, keywords = [];
        for (i = 0; i < metaTagsArr.length; i++) {
          currentTag = metaTagsArr[i];
          if (!!currentTag.getAttribute('property') &&
            !!currentTag.getAttribute('property').trim().match(/VIDEO\:TAG$/i) &&
            !!currentTag.getAttribute('content')) {
            keywords.push(currentTag.getAttribute('content').trim());
          }
        }

        // Get meta tag values 
        for (i = 0; i < metaTagsArr.length; i++) {
          currentTag = metaTagsArr[i];
          if (!!currentTag.getAttribute('name') &&
            currentTag.getAttribute('name').toUpperCase().trim() === 'KEYWORDS' &&
            !!currentTag.getAttribute('content')) {
            var metaKeywords = currentTag.getAttribute('content').split(',');
            for (i = 0; i < metaKeywords.length; i++) {
              var currentKeyword = metaKeywords[i];
              if (!!currentKeyword && !!currentKeyword.trim()) {
                keywords.push(currentKeyword.trim());
              }
            }
            break;
          }
        }

        if (keywords.length > 0) {
          return keywords.join();
        }

        return null;
      };

      var getPageTitle = function () {
        for (var i = 0; i < metaTagsArr.length; i++) {
          var tag = metaTagsArr[i];
          if ((!!tag.getAttribute('property') && tag.getAttribute('property').toUpperCase().trim() === 'OG:TITLE' && !!tag.getAttribute('content')) ||
            (!!tag.getAttribute('name') && tag.getAttribute('name').toUpperCase().trim() === 'TWITTER:TITLE' && !!tag.getAttribute('content'))) {
            return (!!tag.getAttribute('content')) ? tag.getAttribute('content').trim() : '';
          }
        }

        return html.title;
      };

      var metadata = {
        title: getPageTitle(),
        url: currentUrl,
        description: getPageDescription(),
        tags: getPageKeywords()
      };

      // Reset current url
      currentUrl = null;

      // Return metadata
      deferred.resolve(metadata);

      // Close InAppBrowser
      inAppBrowser.close();
      inAppBrowser = null;
    };

    deferred = deferred || $q.defer();

    // If network disconnected fail immediately, otherwise retrieve page metadata
    if (!utility.isNetworkConnected()) {
      handleResponse(null, 'Network disconnected.');
    }
    else {
      inAppBrowser = cordova.InAppBrowser.open(currentUrl, '_blank', 'location=yes,hidden=yes');

      inAppBrowser.addEventListener('loaderror', function (err) {
        if (err && err.code && err.code === -999) {
          return;
        }

        handleResponse(null, err);
      });

      inAppBrowser.addEventListener('loadstop', function () {
        // Remove invasive content and return doc html
        inAppBrowser.executeScript({
          code:
            "(function() { var elements = document.querySelectorAll('video,script'); for (var i = 0; i < elements.length; i++) { elements[i].parentNode.removeChild(elements[i]); } })();" +
            "document.querySelector('html').outerHTML;"
        },
          handleResponse);
      });

      // Time out metadata load after 10 secs
      inAppBrowserTimeout = $timeout(function () {
        if (deferred.promise.$$state.status === 0) {
          handleResponse(null, 'Timed out retrieving page metadata.');
        }
      }, 20000);
    }

    return deferred.promise;
  };

  var hideLoading = function (id, timeout) {
    if (timeout) {
      $timeout.cancel(timeout);
    }

    // Hide loading panel if supplied if matches current
    if (!loadingId || id === loadingId) {
      SpinnerDialog.hide();
      loadingId = null;
    }
  };

  var init = function (viewModel, scope) {
    // Set global variables
    vm = viewModel;
    $scope = scope;

    // Set window and panel heights
    var e = window;
    var a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    var height = e[a + 'Height'] + 'px';
    document.querySelector('html').style.height = height;
    document.querySelector('.view').style.height = height;
    document.querySelector('.background').style.minHeight = height;

    // Load cordova.js
    var script = document.createElement('script');
    script.src = 'cordova.js';
    script.onload = function () {
      // Bind to device events
      document.addEventListener('deviceready', deviceReady, false);
      document.addEventListener('resume', resume, false);
    };
    document.getElementsByTagName('head')[0].appendChild(script);

    // Set async channel to view model
    vm.sync.asyncChannel = vm;

    // Set required events to mobile app handlers
    vm.events.bookmarkPanel_Close_Click = bookmarkPanel_Close_Click;
    vm.events.syncForm_EnableSync_Click = syncForm_EnableSync_Click;

    // Set clear search button to display all bookmarks
    vm.search.displayDefaultState = displayDefaultSearchState;

    // Enable select file to restore
    vm.settings.fileRestoreEnabled = true;

    // Increase search results timeout to avoid display lag
    vm.settings.getSearchResultsDelay = 500;

    // Display existing sync panel by default
    vm.sync.displayNewSyncPanel = false;

    // Check stored app version for upgrade
    checkForUpgrade();
  };

  var openUrl = function (url) {
    OpenUrlExt.open(url, function () { }, function (err) {
      utility.LogInfo('Unable to open url' + (url ? (' ' + url + ': ') : ': '));
      utility.LogError(err, 'platform.openUrl');
    });
  };

  var populateBookmarks = function (xBookmarks) {
    return $q.resolve();
  };

  var refreshInterface = function () {
  };

  var setInLocalStorage = function (itemName, itemValue) {
    localStorage.setItem(itemName, itemValue);
  };

  var scanId = function () {
    var options = {
      'preferFrontCamera': false,
      'showFlipCameraButton': false,
      'prompt': getConstant(globals.Constants.Button_ScanCode_Label),
      'formats': 'QR_CODE'
    };

    var onSuccess = function (result) {
      // Set result as id
      if (result && result.text) {
        $scope.$apply(function () {
          vm.sync.id = result.text;
          platform.LocalStorage.Set(globals.CacheKeys.SyncId, result.text);
        });
      }
    };

    var onError = function (err) {
      // Display alert
      var errMessage = utility.GetErrorMessageFromException({ code: globals.ErrorCodes.FailedScanID });
      vm.alert.display(errMessage.title, err);
    };

    // Activate barcode scanner
    cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);
  };

  var selectBackupFile = function () {
    // Open select file dialog
    document.querySelector('#backupFile').click();
  };

  var shareBookmark = function (bookmark) {
    var options = {
      subject: bookmark.title + ' (' + getConstant(globals.Constants.ShareBookmark_Message) + ')',
      url: bookmark.url,
      chooserTitle: getConstant(globals.Constants.ShareBookmark_Message)
    };

    var onError = function (err) {
      // Display alert
      var errMessage = utility.GetErrorMessageFromException({ code: globals.ErrorCodes.FailedShareBookmark });
      vm.alert.display(errMessage.title, err);
    };

    // Display share sheet
    window.plugins.socialsharing.shareWithOptions(options, null, onError);
  };

  var startAutoUpdates = function () {
    // Check for updates at intervals
    autoUpdatesInterval = $interval(getLatestUpdates, globals.Alarm.Period * 60000);
    return $q.resolve();
  };

  var stopAutoUpdates = function () {
    if (!autoUpdatesInterval) {
      return;
    }

    // Cancel interval
    $interval.cancel(autoUpdatesInterval);
    autoUpdatesInterval = undefined;
  };

  var sync = function (vm, syncData, command) {
    syncData.command = (command) ? command : globals.Commands.SyncBookmarks;

    // Start sync
    return bookmarks.Sync(syncData)
      .then(function (bookmarks, initialSyncFailed) {
        // Reset network disconnected flag
        platform.LocalStorage.Set(globals.CacheKeys.NetworkDisconnected, false);

        // If this sync initially failed, alert the user and refresh search results
        if (initialSyncFailed) {
          vm.alert.display(platform.GetConstant(globals.Constants.ConnRestored_Title), platform.GetConstant(globals.Constants.ConnRestored_Message));

          // Update search results
          displayDefaultSearchState();
        }

        vm.events.handleSyncResponse({
          command: syncData.command,
          bookmarks: bookmarks,
          success: true,
          syncData: syncData
        });
      })
      .catch(function (err) {
        // Don't display another alert if sync retry failed
        if (!syncData.changeInfo && err.code === globals.ErrorCodes.HttpRequestFailedWhileUpdating) {
          return;
        }

        vm.events.handleSyncResponse({ command: syncData.command, success: false, error: err });

        // If sync was disabled, display login panel
        platform.LocalStorage.Get(globals.CacheKeys.SyncEnabled)
          .then(function (syncEnabled) {
            if (!syncEnabled) {
              vm.view.change(vm.view.views.login);
            }
          });
      });
  };

  var updateSingle = function () {
    return $q.resolve();
  };


	/* ------------------------------------------------------------------------------------
	 * Private functions
	 * ------------------------------------------------------------------------------------ */

  var backupFile_Change_Android = function (event) {
    var fileInput = document.getElementById('backupFile');

    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      vm.settings.backupFileName = file.name;
      var reader = new FileReader();

      reader.onload = (function (data) {
        return function (event) {
          $scope.$apply(function () {
            vm.settings.dataToRestore = event.target.result;
          });
        };
      })(file);

      // Read the backup file data
      reader.readAsText(file);
    }
  };

  var bookmarkPanel_Close_Click = function () {
    // Reset current url before switching to main view
    currentUrl = null;
    vm.view.displayMainView();
  };

  var checkForInterruptedSync = function () {
    // TODO: Android: can we remove this?
    return platform.LocalStorage.Get(globals.CacheKeys.IsSyncing)
      .then(function (isSyncing) {
        // Check if a sync was interrupted
        if (isSyncing) {
          // Display login panel
          vm.view.displayMainView();

          // Disable sync
          return bookmarks.DisableSync()
            .then(function () {
              // Display alert
              displayAlert(
                getConstant(globals.Constants.Error_SyncInterrupted_Title),
                getConstant(globals.Constants.Error_SyncInterrupted_Message));
            });
        }
      });
  };

  var checkForSharedUrl = function (syncEnabled) {
    var deferred = $q.defer();

    // If there is a current intent, retrieve it
    window.plugins.webintent.hasExtra(window.plugins.webintent.EXTRA_TEXT,
      function (has) {
        if (has) {
          // Only use the intent if sync is enabled
          if (syncEnabled) {
            window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT,
              function (url) {
                // Remove the intent
                window.plugins.webintent.removeExtra(
                  window.plugins.webintent.EXTRA_TEXT,
                  function () { }
                );

                // Check the URL is valid
                var match = url ? url.match(globals.Regex.Url) : null;
                if (!match || match.length === 0) {
                  return deferred.reject({ code: globals.ErrorCodes.FailedShareUrl });
                }

                // Return the shared url
                return deferred.resolve(match[0]);
              });
          }
          else {
            // Can't use it so remove the intent
            window.plugins.webintent.removeExtra(
              window.plugins.webintent.EXTRA_TEXT,
              function () { }
            );

            // Display alert
            vm.alert.display(null, getConstant(globals.Constants.Error_FailedShareUrlNotSynced_Title));
            deferred.resolve();
          }
        }
        else {
          deferred.resolve();
        }
      }
    );

    return deferred.promise;
  };

  var checkForUpgrade = function () {
    // Disable sync and display updated message if stored app version older than current
    return platform.LocalStorage.Get(globals.CacheKeys.MobileAppVersion)
      .then(function (mobileAppVersion) {
        // If upgrade is available disable sync and display updated panel
        if (compareVersions(mobileAppVersion, globals.AppVersion) < 0) {
          return $q.all([
            platform.LocalStorage.Set(globals.CacheKeys.DisplayUpdated, true),
            bookmarks.DisableSync()
          ]);
        }
      })
      .then(function () {
        // Update stored version to current app version
        return platform.LocalStorage.Set(globals.CacheKeys.MobileAppVersion, globals.AppVersion);
      });
  };

  var displayDefaultSearchState = function () {
    if (vm.view.current !== vm.view.views.search) {
      return;
    }

    // Clear search and display all bookmarks
    document.activeElement.blur();
    vm.search.query = null;
    vm.search.queryMeasure = null;
    vm.search.lookahead = null;
    vm.search.execute();
  };

  var deviceReady = function () {
    // Set platform
    vm.platformName = cordova.platformId;

    // Set back button event
    document.addEventListener('backbutton', handleBackButton, false);

    // Set network offline event
    document.addEventListener('offline', handleNetworkDisconnected, false);

    // Set network online event
    document.addEventListener('online', handleNetworkReconnected, false);

    // Set touchstart event
    document.addEventListener('touchstart', handleTouchStart, false);

    // Set backup file change event
    document.getElementById('backupFile').addEventListener('change', backupFile_Change_Android, false);

    // Use toasts for alerts
    vm.alert.display = displayToast;

    // Reset network disconnected flag
    var networkDisconnected = !utility.IsNetworkConnected();
    platform.LocalStorage.Set(globals.CacheKeys.NetworkDisconnected, networkDisconnected);

    // Check if a sync was interrupted
    checkForInterruptedSync()
      .then(function () {
        return platform.LocalStorage.Get(globals.CacheKeys.SyncEnabled);
      })
      .then(function (syncEnabled) {
        // If sync enabled start regular updates check and display default search results
        if (syncEnabled) {
          startAutoUpdates();
          displayDefaultSearchState();
        }

        // Check if a url was shared
        return checkForSharedUrl(syncEnabled)
          .then(function (sharedUrl) {
            if (syncEnabled && sharedUrl) {
              // Set shared url to current url and display bookmark panel
              currentUrl = sharedUrl;
              return vm.view.change(vm.view.views.bookmark);
            }
          });
      })
      .then(function () {
        // Check if bookmarks need updating, return immediately if network is disconnected
        var checkForUpdates;
        if (!networkDisconnected) {
          checkForUpdates = bookmarks.CheckForUpdates();
        }
        else {
          checkForUpdates = $q.reject({ code: globals.ErrorCodes.HttpRequestFailed });
        }

        checkForUpdates
          .then(function (updatesAvailable) {
            if (!updatesAvailable) {
              return;
            }

            // Show loading overlay if currently on the search panel and no query present
            if (vm.view.current === vm.view.views.search) {
              displayLoading('syncingUpdates');
            }

            // Get bookmark updates
            return sync(vm, { type: globals.SyncType.Pull });
          })
          // Update search results
          .then(displayDefaultSearchState)
          .catch(function (err) {
            // Display alert if not retrieving bookmark metadata
            if (!sharedUrl) {
              var errMessage = utility.GetErrorMessageFromException(err);
              vm.alert.display(errMessage.title, errMessage.message);
            }
          })
          .finally(function () {
            hideLoading('syncingUpdates');
          });
      })
      .catch(function (err) {
        // Display alert
        var errMessage = utility.GetErrorMessageFromException(err);
        vm.alert.display(errMessage.title, errMessage.message);
      });
  };

  var displayToast = function (title, description) {
    var message = (title) ? title + '. ' + description : description;

    window.plugins.toast.showWithOptions({
      message: message,
      duration: 6000,
      position: 'bottom',
      addPixelsY: -50
    });
  };

  var getLatestUpdates = function () {
    return bookmarks.CheckForUpdates()
      .then(function (updatesAvailable) {
        if (!updatesAvailable) {
          return;
        }

        // Show loading overlay if currently on the search panel and no query present
        if (vm.view.current === vm.view.views.search) {
          displayLoading('syncingUpdates');
        }

        // Get bookmark updates
        return sync(vm, { type: globals.SyncType.Pull });
      })
      // Update search results
      .then(displayDefaultSearchState)
      .finally(function () {
        hideLoading('syncingUpdates');
      });
  };

  var handleBackButton = function (event) {
    if (vm.view.current === vm.view.views.bookmark ||
      vm.view.current === vm.view.views.settings ||
      vm.view.current === vm.view.views.about
    ) {
      // Back to login/search panel
      event.preventDefault();
      vm.view.displayMainView();
    }
    else {
      // On main view, exit app
      event.preventDefault();
      navigator.app.exitApp();
    }
  };

  var handleNetworkDisconnected = function () {
    platform.LocalStorage.Set(globals.CacheKeys.NetworkDisconnected, true);
  };

  var handleNetworkReconnected = function () {
    // If a previous sync failed due to lost connection, check for updates now
    platform.LocalStorage.Get([
      globals.CacheKeys.NetworkDisconnected,
      globals.CacheKeys.SyncEnabled
    ])
      .then(function (cachedData) {
        networkDisconnected = cachedData[globals.CacheKeys.NetworkDisconnected];
        syncEnabled = cachedData[globals.CacheKeys.SyncEnabled];

        if (syncEnabled && networkDisconnected) {
          getLatestUpdates()
            // Update search results
            .then(refreshSearchResults);
        }
      });
  };

  var handleTouchStart = function (event) {
    // Blur focus (and hide keyboard) when pressing out of text fields
    if (!isTextInput(event.target) && isTextInput(document.activeElement)) {
      $timeout(function () {
        document.activeElement.blur();
      }, 100);
    }
    // Deselect selected bookmark
    else if (vm.search.selectedBookmark) {
      vm.search.selectedBookmark = null;
    }
  };

  var isTextInput = function (node) {
    return ['INPUT', 'TEXTAREA'].indexOf(node.nodeName) !== -1;
  };

  var refreshSearchResults = function () {
    if (vm.view.current !== vm.view.views.search) {
      return;
    }

    // Refresh search results
    document.activeElement.blur();
    vm.search.execute();
  };

  var resume = function () {
    var sharedUrl, syncEnabled;
    var networkDisconnected = !utility.IsNetworkConnected();

    // Check if sync enalbed and reset network disconnected flag
    $q.all([
      platform.LocalStorage.Get(globals.CacheKeys.SyncEnabled),
      platform.LocalStorage.Set(globals.CacheKeys.NetworkDisconnected, networkDisconnected)
    ])
      .then(function (cachedData) {
        syncEnabled = cachedData[globals.CacheKeys.SyncEnabled];

        // Deselect bookmark
        vm.search.selectedBookmark = null;

        // Check if a url was shared
        return checkForSharedUrl(syncEnabled);
      })
      .then(function (checkForSharedUrlResponse) {
        sharedUrl = checkForSharedUrlResponse;

        if (!syncEnabled) {
          return;
        }

        if (sharedUrl) {
          // Set shared url to current url and display bookmark panel
          currentUrl = sharedUrl;
          vm.view.change(vm.view.views.bookmark);
        }

        // Check if bookmarks need updating, return immediately if network is disconnected
        var checkForUpdates;
        if (!networkDisconnected) {
          checkForUpdates = bookmarks.CheckForUpdates();
        }
        else {
          checkForUpdates = $q.reject({ code: globals.ErrorCodes.HttpRequestFailed });
        }

        return checkForUpdates
          .then(function (updatesAvailable) {
            if (!updatesAvailable) {
              return;
            }

            // Show loading overlay if currently on the search panel
            if (vm.view.current === vm.view.views.search) {
              displayLoading('syncingUpdates');
            }

            // Get bookmark updates
            return sync(vm, { type: globals.SyncType.Pull })
              .then(function () {
                // Update search results if currently on the search panel and no query entered
                if (vm.view.current === vm.view.views.search && !vm.search.query) {
                  refreshSearchResults();
                }
              });
          })
          .finally(function () {
            hideLoading('syncingUpdates');
          });
      })
      .catch(function (err) {
        // Don't display alert if url was shared or if network error encountered
        if (!sharedUrl && err.code !== globals.ErrorCodes.HttpRequestFailed) {
          var errMessage = utility.GetErrorMessageFromException(err);
          vm.alert.display(errMessage.title, errMessage.message);
        }
      });
  };

  var syncForm_EnableSync_Click = function () {
    // Don't display confirmation before syncing
    vm.events.syncForm_ConfirmSync_Click();
  };

  // Call constructor
  return new AndroidImplementation();
};