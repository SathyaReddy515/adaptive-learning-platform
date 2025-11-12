const hashedPasswords = 
[
  '$2a$10$OhEP/LA6F9wxuzuU3PjW4O2aLudlvfiPwqEe.rtZBiWZ25thZYJ7e',
  '$2a$10$6iJsVlWh4Zdw1HEEzhVPbuUAxCuesMRdCj8ii9WsOFu7hVPAdRjdS',
  '$2a$10$wKcKaXg.5i.Pr0ajIePXXuyS0bGkcZgbDAB4ukY6XbQ6yreIwXDsS',
  '$2a$10$f1s2lWtDUBirMimPfxYp3OToGEAR7IllPI85QR0gRHR.szrNXE15C',
  '$2a$10$rQwo22lRMOxVtQc3uqwzweQzSyQSXBIOe7JHlqzKaP6nsTwgpylOm'
]
const users = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: hashedPasswords[0],
    role: 'admin',
  },
  {
    name: 'Teacher User',
    email: 'teacher@test.com',
    password: hashedPasswords[1],
    role: 'instructor',
  },
  {
    name: 'Student One',
    email: 'student1@test.com',
    password: hashedPasswords[2],
    role: 'student',
  },
  {
    name: 'Student Two',
    email: 'student2@test.com',
    password: hashedPasswords[3],
    role: 'student',
  },
  {
    name: 'Student Three',
    email: 'student3@test.com',
    password: hashedPasswords[4],
    role: 'student',
  },
];

module.exports = users;