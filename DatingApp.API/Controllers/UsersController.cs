using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Controllers
{
    [Authorize]
    public class UsersController : BaseAPIController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this._userRepository = userRepository;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> Getusers()
        {
            var users = await _userRepository.GetMembersAsync();
            return Ok(users);

            //var users = await _userRepository.GetUsersAsync();

            //var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            //return Ok(usersToReturn);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> Getuser(string username)
        {
            return await _userRepository.GetMemberAsync(username);

            //var user = await _userRepository.GetUserByUsernameAsync(username);

            //return _mapper.Map<MemberDto>(user);           
        }
    }
}
