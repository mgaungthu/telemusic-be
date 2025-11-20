import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { AddCommentDto } from '../dto/add-comment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('engagement/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post(':songId')
  @UseGuards(JwtAuthGuard)
  add(
    @Req() req: any,  
    @Param('songId') songId: bigint,
    @Body() dto: AddCommentDto,
  ) {
    console.log("REQ.USER =", req.user);
    const userId = BigInt(req.user.id);
    
    return this.commentsService.addComment(userId, songId, dto.content);
  }

  @Get(':songId')
  getComments(@Param('songId') songId: bigint) {
    return this.commentsService.getComments(songId);
  }

//   @Put(':commentId/:songId')
//   @UseGuards(JwtAuthGuard)
//   edit(
//     @Param('commentId') commentId: bigint,
//     @Param('songId') songId: bigint,
//     @Body() dto: EditCommentDto,
//   ) {
//     return this.commentsService.editComment(commentId, songId, dto.content);
//   }

  @Delete(':commentId/:songId')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('commentId') commentId: bigint,
    @Param('songId') songId: bigint,
  ) {
    return this.commentsService.deleteComment(commentId, songId);
  }
}