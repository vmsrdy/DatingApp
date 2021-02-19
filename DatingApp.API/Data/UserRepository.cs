using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users.Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                //.Select(user => new MemberDto
                //{
                //    Id =user.Id,
                //    Username = user.UserName
                //})
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParms)
        {
            var query = _context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParms.CurrentuserName);
            query = query.Where(u => u.Gender == userParms.Gender);

            var minDob = DateTime.Today.AddYears(-userParms.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(userParms.MinAge);

            //query = query.Where(u => u.DateofBirth >= minDob && u.DateofBirth <= maxDob);

            query = userParms.OrderBy switch
            {
                "Created" =>query.OrderByDescending(u=>u.Created),
                _ =>query.OrderByDescending(u=> u.LastActive)
            };
            //var query = _context.Users
            //    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            //   .AsNoTracking();

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                        userParms.PageNumber, userParms.PageSize); 
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p=>p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}
