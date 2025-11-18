<?php

namespace App\Persistence\Project\Mapper;

use App\Business\Project\Model\MilestoneModel;
use App\Persistence\Project\Entity\Milestone;

class MilestoneMapper
{
    public static function toModel(Milestone $milestone): MilestoneModel
    {
        return new MilestoneModel(
            uuid: $milestone->uuid,
            projectUuid: $milestone->project->uuid,
            title: $milestone->title,
            description: $milestone->description,
            dateYear: $milestone->date_year,
            dateMonth: $milestone->date_month,
            dateWeek: $milestone->date_week,
        );
    }
}
