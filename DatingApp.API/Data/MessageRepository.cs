using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context,IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public void AddMessasge(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups
                .Include(c => c.connections)
                .Where(c => c.connections.Any(x => x.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            //return await _context.Messages.FindAsync(id);
            return await _context.Messages
                        .Include(u=>u.Sender)
                        .Include(u=>u.Recipient)
                        .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Group> GetMessageGroup(string groupname)
        {
            return await _context.Groups
                .Include(x => x.connections).FirstOrDefaultAsync(x => x.Name == groupname);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageparams)
        {
            var query = _context.Messages.OrderByDescending(m => m.MessageSent).AsQueryable();

            query = messageparams.Container switch
            {
                "Inbox" => query.Where(u => u.Recipient.UserName == messageparams.Username && u.RecipientDeleted == false),
                "Outbox" => query.Where(u => u.Sender.UserName == messageparams.Username && u.SenderDeleted == false),
                _ => query.Where(u => u.Recipient.UserName == messageparams.Username && u.RecipientDeleted == false && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageparams.PageNumber, messageparams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await _context.Messages.Include(u => u.Sender).ThenInclude(p => p.Photos)
                                                  .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                                  .Where(m => m.Recipient.UserName == currentUsername 
                                            && m.RecipientDeleted == false
                                            && m.Sender.UserName == recipientUsername
                                   || m.Recipient.UserName == recipientUsername 
                                            && m.Sender.UserName == currentUsername 
                                            && m.SenderDeleted == false)
                                                  .OrderBy(m => m.MessageSent).ToListAsync();

            var unreadMessages = messages.Where(u => u.DateRead == null && u.Recipient.UserName == currentUsername).ToList();

            if(unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }        
    }
}
