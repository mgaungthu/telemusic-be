import { IsNumber, IsEnum } from 'class-validator';
import { PaymentGateway } from "@/common/enum/payment-gateway.enum";

export class CreateWithdrawalDto {
  @IsNumber()
  amount: number;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;
}