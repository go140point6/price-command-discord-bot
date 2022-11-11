import { CommandInt } from "../interfaces/CommandInt";
import { ping } from "./ping";
import { beep } from "./beep";
import { xrplToken } from "./xrplToken";

exports.CommandList = [ping, beep, xrplToken];