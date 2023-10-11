import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { PublicRoute } from "src/common/decorators/public_route.decorator";
import { FpyFilterDto } from "./dtos/filter-fpy.dto";
import { FilterTravelCardDto } from "./dtos/filter-travel-card.dto";
import { TravelCardEntity } from "./entities/travel-card.entity";
import { TravelCardService } from "./travel-card.service";


@Controller('travel-card')
@ApiTags('Travel Card')
@ApiBearerAuth()

export class TravelCardController {
    constructor(
        private readonly travelCardService: TravelCardService ) {}
    

    @Get()
    @UseGuards(PermissionGuard(Permission.Travelcard.READ))
    async findAll(@Query()
    filter: FilterTravelCardDto): Promise<Pagination<TravelCardEntity>> {
        return await this.travelCardService.findAll(filter);
    }

    @Get('/all-merged_data')
    @UseGuards(PermissionGuard(Permission.Travelcard.READ))
    async findAllTravels(@Query()
    filter: FilterTravelCardDto): Promise<Pagination<TravelCardEntity>> {
        return await this.travelCardService.findAllMergedTravel(filter);
    }

    @Get('/situation/:serial')
    @UseGuards(PermissionGuard(Permission.Travelcard.READ))
    async getBySerial(@Param('serial') serial: string) {
    return await this.travelCardService.findBySerial(serial);
   }
        

    @Get('/fpy')
    @UseGuards(PermissionGuard(Permission.Fpy.READ))
    async getFpyForMst(@Query() filter: FpyFilterDto): Promise<TravelCardEntity[]> {
        return await this.travelCardService.getFpyForMst(filter);
    }
}