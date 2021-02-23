using DatingApp.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.SignalR
{
    public class PresenceHub : Hub
    {
        private readonly PresenseTracker _tracker;

        public PresenceHub(PresenseTracker tracker)
        {
            this._tracker = tracker;
        }

        [Authorize]
        public override async Task OnConnectedAsync()
        {
            var isOnline = await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            if (isOnline)
            {
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
            }
            var currentusers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentusers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var isOffline = await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            if (isOffline)
            {
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
            }
            //var currentusers = await _tracker.GetOnlineUsers();
            //await Clients.All.SendAsync("GetOnlineUsers", currentusers);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
