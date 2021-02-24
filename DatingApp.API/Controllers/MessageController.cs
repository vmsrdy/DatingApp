using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Extensions;
using DatingApp.API.Entities;
using DatingApp.API.Helpers;

namespace DatingApp.API.Controllers
{
    [Authorize]
    public class MessageController :BaseAPIController
    {
        //private readonly IUserRepository _userRepository;
        //private readonly IMessageRepository _messageRespository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public MessageController( IMapper mapper, IUnitOfWork unitOfWork)//IUserRepository userRepository, IMessageRepository messageRespository,
        {
            //this._userRepository = userRepository;
            //this._messageRespository = messageRespository;
            this._mapper = mapper;
            this._unitOfWork = unitOfWork;
        }
        [HttpPost]
        //public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        //{
        //    var username = User.GetUsername();

        //    if (username == createMessageDto.RecipientUserName.ToLower()) return BadRequest("You cannot send message to yourself");

        //    var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        //    var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUserName);

        //    if (recipient == null) return NotFound();
        //    var message = new Message
        //    {
        //        Sender = sender,
        //        Recipient = recipient,
        //        SenderuserName = sender.UserName,
        //        RecipientUserName = recipient.UserName,
        //        Content = createMessageDto.Content
        //    };

        //    _unitOfWork.MessageRepository.AddMessasge(message);

        //    if (await _unitOfWork.Complete()) return Ok(_mapper.Map<MessageDto>(message));

        //    return BadRequest("failed to Send message");
        //}

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageparams)
        {
            messageparams.Username = User.GetUsername();
            var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageparams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

            return messages;
        }

        //[HttpGet("thread/{username}")]
        //public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        //{
        //    var currentUsername = User.GetUsername();

        //    return Ok(await _messageRespository.GetMessageThread(currentUsername, username));
        //}

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await _unitOfWork.MessageRepository.GetMessage(id);
            if (message.Sender.UserName != username && message.Recipient.UserName != username)
                return Unauthorized();

            if (message.Sender.UserName == username) 
                message.SenderDeleted = true;
            if (message.Recipient.UserName == username) 
                message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _unitOfWork.MessageRepository.DeleteMessage(message);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("problem while deleting the message");
        }
    }
}
