"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterAuthDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterAuthDto {
    phone_number;
    password;
    username;
    firstName;
    lastName;
    session_token;
}
exports.RegisterAuthDto = RegisterAuthDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "phone_number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.MinLength)(4),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.MinLength)(4),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "session_token", void 0);
//# sourceMappingURL=register.dto.js.map