<?php

namespace App\Models\Finance;

use App\Models\Size;
use App\Models\Color;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Categories;
use App\Models\HeelHeight;
use App\Models\SizeValues;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Model;
use App\Models\Finance\PromotionConditions;

class Promotions extends Model
{
    protected $fillabe = [
        'type',
        'discount_value',
        'is_active',
        'promotion_from',
        'starts_at',
        'ends_at',
        'name',
    ];

    public function promotionFrom(){
        return $this->belongsTo(Warehouse::class, 'promotion_from', 'id');
    }

    public function conditions(){
        return $this->hasMany(PromotionConditions::class, 'promotion_id', 'id');
    }

    public function matches(ProductVariant $variant): bool
    {
        // 1️⃣ Grab all the condition rows for this promo
        $conds = $this->conditions()->get();
        //    → This pulls every row from promotion_conditions where promotion_id = $this->id,
        //      giving you a Collection of e.g.:
        //      [ { conditional_type: 'product',   conditional_id: '1' },
        //        { conditional_type: 'product',   conditional_id: '3' },
        //        { conditional_type: 'color',     conditional_id: '2' },
        //        { conditional_type: 'heel_height',conditional_id: '5' },
        //        { conditional_type: 'heel_height',conditional_id: '6' } ]
    
        // 2️⃣ If there are *no* conditions, this promo shouldn’t match anything
        if ($conds->isEmpty()) {
            return false;
        }
    
        // 3️⃣ Map each conditional_type to the matching ProductVariant property
        $fieldMap = [
            'product'      => 'product_id',
            'color'        => 'color_id',
            'heel_height'  => 'heel_height_id',
            'size'         => 'size_id',
            'size_value'   => 'size_value_id',
            'category'     => 'category_id',
        ];
        //    → This tells us “when you see a type of 'color', compare against $variant->color_id”.
    
        // 4️⃣ Group the conditions by their type so we can OR within each group
        $byType = $conds->groupBy('conditional_type');
        //    → Now $byType looks like:
        //      [
        //        'product'      => Collection([ cond1, cond2 ]),
        //        'color'        => Collection([ cond3 ]),
        //        'heel_height'  => Collection([ cond4, cond5 ]),
        //      ]
    
        // 5️⃣ For each type-group, make sure the variant’s field is *in* the allowed IDs
        foreach ($byType as $type => $group) {
            // 5a) Skip any weird types we don’t know how to handle
            if (! isset($fieldMap[$type])) {
                continue;
            }
    
            // 5b) Figure out which property on the variant to check
            $field = $fieldMap[$type];
            //     e.g. if $type = 'heel_height', then $field = 'heel_height_id'
    
            // 5c) Build the list of IDs we allow for this group
            $allowedIds = $group
                ->pluck('conditional_id')        // e.g. ['5','6']
                ->map(fn($id) => (int)$id)      // [5,6]
                ->all();                        // plain PHP array
    
            // 5d) If the variant’s actual value isn’t in that array, FAIL
            if (! in_array($variant->$field, $allowedIds, true)) {
                return false;
            }
            //     → This enforces the “OR within type”: e.g.
            //       heel_height_id must be either 5 *or* 6.
            //     → And by returning false here, we enforce “AND across types”: if *any*
            //       of the type-groups fails, the whole promo is invalid for this variant.
        }
    
        // 6️⃣ If we never bailed out, *all* type-groups passed → MATCH!
        return true;
    }
}
